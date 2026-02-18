import { query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import type { GenericQueryCtx } from "convex/server";
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
