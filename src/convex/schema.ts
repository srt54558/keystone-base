import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// [KEYSTONE_MODULE_IMPORTS]
// (Imports from modules will be injected here)

export default defineSchema({
  // 1. USERS (Local Mirror of Better Auth User)
  users: defineTable({
    // Synced from Better Auth via hooks
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    emailVerified: v.boolean(),
    authUserId: v.string(), // Link to the real auth user in the component
  })
  .index("by_email", ["email"])
  .index("by_auth_user_id", ["authUserId"]),

  // [KEYSTONE_MODULE_TABLES]
  // (Module table definitions will be injected here)
});
