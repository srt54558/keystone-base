import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. USERS (Local Mirror of Better Auth User + SaaS Fields)
  users: defineTable({
    // Synced from Better Auth via hooks
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    emailVerified: v.boolean(),
    authUserId: v.string(), // Link to the real auth user in the component

    // SaaS Fields
    polarCustomerId: v.optional(v.string()),
    subscriptionStatus: v.optional(v.string()), // "active", "past_due"
    licenseKey: v.optional(v.string()), 
    isActive: v.optional(v.boolean()),
  })
  .index("by_email", ["email"])
  .index("by_auth_user_id", ["authUserId"])
  .index("by_license", ["licenseKey"])
  .index("by_polar_id", ["polarCustomerId"]),
});
