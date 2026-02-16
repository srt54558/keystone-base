import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel } from "./_generated/dataModel";
import type { Doc } from "./_generated/dataModel";

export const createLocalUser = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    emailVerified: v.boolean(),
    authUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.authUserId))
      .unique();

    if (!existing) {
      await ctx.db.insert("users", {
        name: args.name || "User",
        email: args.email,
        image: args.image,
        emailVerified: args.emailVerified,
        authUserId: args.authUserId,
      });
    }
  },
});

export const deleteUserData = internalMutation({
  args: { authUserId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.authUserId))
      .unique();

    if (!user) return;
    await ctx.db.delete(user._id);
  },
});

export const syncSubscriptionWebhook = internalMutation({
  args: {
    webhookSecret: v.string(),
    email: v.string(),
    polarCustomerId: v.string(),
    subscriptionStatus: v.string(),
    licenseKey: v.optional(v.string()),
    authUserId: v.optional(v.string()),
  },
  handler: async (ctx: GenericMutationCtx<DataModel>, args) => {
    if (args.webhookSecret !== process.env.POLAR_WEBHOOK_SECRET) {
      throw new Error("Invalid webhook secret");
    }

    // 1. Try to find by authUserId (Metadata is most reliable for primary link)
    let user = args.authUserId 
      ? await ctx.db
          .query("users")
          .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.authUserId!))
          .unique()
      : null;

    // 2. Try to find by polarCustomerId (Reliable for subsequent grants/webhooks)
    if (!user && args.polarCustomerId) {
      user = await ctx.db
        .query("users")
        .withIndex("by_polar_id", (q) => q.eq("polarCustomerId", args.polarCustomerId))
        .unique();
    }

    // 3. Fallback to email
    if (!user && args.email) {
      user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .unique();
    }

    if (user) {
      await ctx.db.patch(user._id, {
        polarCustomerId: args.polarCustomerId || user.polarCustomerId,
        subscriptionStatus: args.subscriptionStatus,
        licenseKey: args.licenseKey || user.licenseKey,
        isActive: args.subscriptionStatus === "active",
      });
    } else {
      console.error("Sync Fail: Could not resolve user during webhook.");
    }
  },
});

export const getMeInternal = internalQuery({
  args: { authUserId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", args.authUserId))
      .unique();
  },
});

export const getMe = query({
  args: {},
  handler: async (ctx: GenericQueryCtx<DataModel>): Promise<Doc<"users"> | null> => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return null;

    const authId: string = (authUser as any).id || authUser._id;

    return await ctx.db
      .query("users")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", authId))
      .unique();
  },
});
