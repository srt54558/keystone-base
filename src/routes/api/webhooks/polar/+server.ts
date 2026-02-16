import { Webhooks } from "@polar-sh/sveltekit";
import { POLAR_WEBHOOK_SECRET } from "$env/static/private";
import { PUBLIC_CONVEX_URL } from "$env/static/public";
import { ConvexHttpClient } from "convex/browser";
import { api } from "$convex/_generated/api";

export const POST = Webhooks({
  webhookSecret: POLAR_WEBHOOK_SECRET,
  onPayload: async (payload) => {
    if (payload.type.startsWith('subscription.')) {
        const subscription = payload.data as any; 

        let email = subscription.user?.email || subscription.customer?.email; 

        if (email) {
            const client = new ConvexHttpClient(PUBLIC_CONVEX_URL);
            await client.mutation(api.users.syncSubscriptionWebhook, {
                webhookSecret: POLAR_WEBHOOK_SECRET,
                email: email,
                polarCustomerId: subscription.customer_id || "",
                subscriptionStatus: subscription.status,
            });
        } else {
            console.error("Critical: Polar webhook missing customer email identifier.");
        }
    }
  },
});
