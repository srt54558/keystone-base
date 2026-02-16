import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components, internal } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";
import { internalQuery, query } from "./_generated/server";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import authConfig from "./auth.config";
import type { GenericQueryCtx, GenericActionCtx } from "convex/server";

import { sendEmail } from "./utils/email";

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
  handler: async () => null,
});

// Match future-forger's authComponent definition exactly
export const authComponent: ReturnType<typeof createClient<DataModel>> = createClient<DataModel>(components.betterAuth, {
  verbose: false,
  // @ts-ignore
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
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    },
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
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          await sendEmail({
            to: email,
            subject: "Verify your Keystone Identity",
            html: `
              <div style="font-family: sans-serif; background-color: #09090b; color: #fafafa; padding: 40px; border-radius: 8px;">
                <h2 style="color: #ffffff;">Keystone Protocol</h2>
                <p style="color: #a1a1aa;">Click the link below to verify your identity and enter the workspace.</p>
                <div style="margin-top: 20px;">
                  <a href="${url}" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold;">Verify Identity</a>
                </div>
                <p style="margin-top: 30px; font-size: 12px; color: #52525b;">If you did not request this, you can safely ignore this email.</p>
              </div>
            `
          });
        }
      }),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx: GenericQueryCtx<DataModel>) => {
    return authComponent.getAuthUser(ctx);
  },
});
