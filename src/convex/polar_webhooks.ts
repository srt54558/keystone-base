import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Polar } from "@polar-sh/sdk";

export const handle = httpAction(async (ctx, request) => {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    console.error("POLAR_WEBHOOK_SECRET not set");
    return new Response("Configuration error", { status: 500 });
  }

  const headers = request.headers;
  const payload = await request.text();
  
  const webhookId = headers.get("webhook-id");
  const webhookTimestamp = headers.get("webhook-timestamp");
  const webhookSignature = headers.get("webhook-signature");

  if (!webhookId || !webhookTimestamp || !webhookSignature) {
    return new Response("Missing headers", { status: 400 });
  }

  // Verification
  const signedPayload = `${webhookId}.${webhookTimestamp}.${payload}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(signedPayload));
  const computedSignature = `v1,${btoa(String.fromCharCode(...new Uint8Array(signatureBytes)))}`;

  const signatures = webhookSignature.split(" ");
  if (!signatures.some((sig) => sig === computedSignature)) {
    console.error("Polar Webhook: Signature mismatch");
    return new Response("Signature mismatch", { status: 401 });
  }

  const event = JSON.parse(payload) as any;

  const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
  });

  // --- 1. Order Paid: Unlock Blueprint & Link Customer ---
  if (event.type === "order.paid") {
    const data = event.data;
    const email = data.customer_email || data.user?.email;
    const customerId = data.customer_id;
    const metadata = data.metadata || {};
    const blueprintId = metadata.blueprintId;
    const authUserId = metadata.authUserId;

    // Unlock the blueprint immediately
    if (blueprintId) {
      await ctx.runMutation(internal.blueprints.markAsPaid, { id: blueprintId });
      
      const conversation = await ctx.runMutation(internal.messages.getOrCreateInternal, { blueprintId });
      if (conversation) {
        await ctx.runMutation(internal.messages.sendInternal, {
            conversationId: conversation._id,
            role: 'assistant',
            content: "**Payment verified.** Neural constraints lifted.\n\nAll premium files are now unlocked and the system has opened its full potential for materialization."
        });
      }
    }

    // Sync subscription status and link customerId
    await ctx.runMutation(internal.users.syncSubscriptionWebhook, {
      webhookSecret: secret,
      email: email,
      authUserId: authUserId,
      polarCustomerId: customerId,
      subscriptionStatus: "active",
    });
  }

  // --- 2. Benefit Grant: Deliver the License Key ---
  if (event.type === "benefit_grant.created") {
    const grant = event.data;
    const customerId = grant.customer_id;
    const customerEmail = grant.customer?.email;
    const properties = grant.properties || {};

    // Check if this is a license key benefit
    if (grant.benefit.type === "license_keys" && properties.license_key_id) {
      try {
        // Fetch the specific key by ID (zero-scanning, highly efficient)
        const licenseKeyObj = await polar.licenseKeys.get({
          id: properties.license_key_id
        });

        if (licenseKeyObj && licenseKeyObj.key) {
          // Update the user record with the real key
          await ctx.runMutation(internal.users.syncSubscriptionWebhook, {
            webhookSecret: secret,
            email: customerEmail || "", 
            polarCustomerId: customerId,
            subscriptionStatus: "active",
            licenseKey: licenseKeyObj.key
          });
        }
      } catch (e) {
        console.error("Polar Webhook: Failed to fetch license key detail");
      }
    }
  }

  return new Response(null, { status: 200 });
});
