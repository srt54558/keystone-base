import { action } from "./_generated/server";
import { v } from "convex/values";
import { Polar } from "@polar-sh/sdk";
import { authComponent } from "./auth";

export const createCheckout = action({
  args: {
    productId: v.string(), 
    blueprintId: v.optional(v.string()),
    publicId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Unauthorized");

    const polar = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      server: process.env.POLAR_SERVER === "sandbox" ? "sandbox" : "production",
    });

    const siteUrl = process.env.SITE_URL ?? "http://localhost:5173";
    
    // Determine the return path - Prioritize Public ID for clean URLs
    const idForUrl = args.publicId || args.blueprintId;
    const returnPath = idForUrl 
        ? `/onboarding/workspace/${idForUrl}` 
        : '/prototype';

    try {
      const result = await polar.checkouts.create({
        products: [args.productId],
        successUrl: `${siteUrl}${returnPath}?checkout_id={CHECKOUT_ID}`,
        customerEmail: authUser.email,
        metadata: {
          authUserId: authUser._id,
          blueprintId: args.blueprintId ?? "",
        },
      });

      return result.url;
    } catch (err) {
      console.error("Critical: Polar checkout initialization failed.");
      throw new Error("Payment gateway currently unavailable. Please try again later.");
    }
  },
});
