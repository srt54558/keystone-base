import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components, internal } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";
import { internalQuery, query } from "./_generated/server";
import { betterAuth } from "better-auth";
import authConfig from "./auth.config";
import type { GenericQueryCtx, GenericActionCtx } from "convex/server";

if (!URL.canParse) {
  URL.canParse = (url: string, base?: string) => {
    try {
      new URL(url, base);
      return true;
    } catch {
      return false;
    }
  };
}

export const debug = internalQuery({
  args: {},
  handler: async () => null,
});

// Match future-forger's authComponent definition exactly
export const authComponent: ReturnType<typeof createClient<DataModel>> = createClient<DataModel>(components.betterAuth, {
  verbose: false,
  // @ts-expect-error better-auth component exposes authFunctions at runtime
  authFunctions: internal.auth,
  triggers: {},
});

// Explicitly export the actions from the component
// The type error suggests 'auth' might not be on the inferred type, 
// but it is required for the internal API loop. 
// I will use a type assertion to satisfy the compiler while maintaining functionality.
export const auth = (authComponent as any).auth;

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  const siteUrl = process.env.SITE_URL ?? "http://localhost:5173";
  
  return betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: siteUrl,
    trustedOrigins: [siteUrl, "http://localhost:5173"],
    database: authComponent.adapter(ctx),
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await (ctx as GenericActionCtx<DataModel>).runMutation(internal.users.createLocalUser, {
              name: user.name,
              email: user.email,
              image: user.image ?? undefined,
              emailVerified: user.emailVerified,
              authUserId: user.id,
            });
          },
        },
        delete: {
          after: async (user) => {
            await (ctx as GenericActionCtx<DataModel>).runMutation(internal.users.deleteUserData, {
              authUserId: user.id,
            });
          },
        },
      },
    },
    plugins: [
      convex({ authConfig }),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx: GenericQueryCtx<DataModel>) => {
    return authComponent.getAuthUser(ctx);
  },
});
