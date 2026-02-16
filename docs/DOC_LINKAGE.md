# DOCUMENTATION LINKAGE MAP

This document maps Keystone Modules to the exact sections of official documentation used to derive their technical specifications. Use this to verify logic integrity and update modules when upstream APIs change.

## 1. Auth-Plus (Better Auth)
* **Source:** Better Auth Official Docs & Convex Adapter Guide.
* **Integrity Checks:**
  * **Convex Integration:** [https://www.better-auth.com/docs/integrations/convex](https://www.better-auth.com/docs/integrations/convex)
    * *Used for:* `users`, `sessions`, `accounts` schema definitions.
  * **Passkeys:** [https://www.better-auth.com/docs/plugins/passkey](https://www.better-auth.com/docs/plugins/passkey)
    * *Used for:* `passkeys` table schema (`publicKey`, `credentialID`, `counter`).
  * **MFA/Two-Factor:** [https://www.better-auth.com/docs/plugins/2fa](https://www.better-auth.com/docs/plugins/2fa)
    * *Used for:* `twoFactor` table schema (`secret`, `backupCodes`).

## 2. Billing-Usage (Polar.sh)
* **Source:** Polar Developer Docs.
* **Integrity Checks:**
  * **Credits API:** [https://polar.sh/docs/api-reference/credits](https://polar.sh/docs/api-reference/credits)
    * *Used for:* `credits` table logic and `grantCredits` action.
  * **Metered Billing:** [https://polar.sh/docs/features/usage-based-billing](https://polar.sh/docs/features/usage-based-billing)
    * *Used for:* `usageEvents` table design (aggregation before flush).

## 3. Notify-Flow (Resend & Firebase)
* **Source:** Resend Docs & Firebase Cloud Messaging (FCM) Docs.
* **Integrity Checks:**
  * **Resend Node.js:** [https://resend.com/docs/send-with-nodejs](https://resend.com/docs/send-with-nodejs)
    * *Used for:* `sendEmail` action signature.
  * **FCM Server:** [https://firebase.google.com/docs/cloud-messaging/send-message](https://firebase.google.com/docs/cloud-messaging/send-message)
    * *Used for:* `pushTokens` table (`token`, `deviceType`) and `sendPush` action.

## 4. AI-Logic (Convex)
* **Source:** Convex Developer Hub.
* **Integrity Checks:**
  * **Vector Search:** [https://docs.convex.dev/search/vector-search](https://docs.convex.dev/search/vector-search)
    * *Used for:* `defineTable(...).vectorIndex` syntax and `ctx.vectorSearch` API.
  * **Streaming Actions:** [https://docs.convex.dev/functions/actions#calling-third-party-apis](https://docs.convex.dev/functions/actions#calling-third-party-apis)
    * *Used for:* `streamResponse` architecture (Action -> Mutation writes).

## 5. Metrics-Core (PostHog)
* **Source:** PostHog Docs.
* **Integrity Checks:**
  * **Svelte Integration:** [https://posthog.com/docs/libraries/svelte](https://posthog.com/docs/libraries/svelte)
    * *Used for:* `PostHogProvider.svelte` initialization and Session Replay config.
  * **Node.js SDK:** [https://posthog.com/docs/libraries/node](https://posthog.com/docs/libraries/node)
    * *Used for:* `trackServerEvent` action (backend event capture).
