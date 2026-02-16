# KEYSTONE MODULE SPECIFICATION (V2.0 - EXPANDED CATALOG)

## 1. The Keystone Module Standard
A Keystone Module is a self-contained "Lego brick" designed to be dropped into a Keystone project. It encapsulates database schema, backend logic (Convex), frontend UI (Svelte), and configuration.

### Directory Structure
Each module (e.g., `billing-usage`) must follow this exact structure:

```
billing-usage/
├── module.config.json    # Manifest: ID, dependencies, ENV vars, events
├── module.schema.ts      # Database schema definitions (Convex)
├── module.api.ts         # Backend API functions (Convex)
├── module.ui/            # Frontend components (Svelte)
│   ├── index.ts          # Exports for the UI
│   └── components/       # Internal Svelte components
└── README.md             # Usage instructions
```

---

## 2. The Event Bus (Module Events)
To ensure absolute modularity, modules must not import each other's API functions directly. Instead, they communicate via a strongly-typed Event Bus running on Convex.

### Mechanism
- **Emission:** Any module can emit an event via `ctx.runMutation(internal.events.emit, { topic: "auth.user_created", payload: { ... } })`.
- **Subscription:** Modules declare their listeners in `module.config.json`.
- **Dispatch:** A core background job (`internal.events.dispatch`) matches topics to registered module actions and schedules them asynchronously.

### `module.config.json` Example
```json
{
  "id": "billing-usage",
  "listensTo": {
    "auth.user_created": "api:createCustomer",
    "org.member_added": "api:updateSeatCount"
  }
}
```

---

## 3. The Expanded Module Catalog

### Module A: Auth-Plus (Identity)
**Purpose:** Advanced authentication via Better Auth (Social, Passkeys, MFA).
**Config:** `{"id": "auth-plus", "env": ["BETTER_AUTH_SECRET", "GITHUB_CLIENT_ID", "GOOGLE_CLIENT_ID"], "emits": ["auth.user_created", "auth.session_started"]}`

#### `module.schema.ts`
*Extends standard user tables with Better Auth specific requirements.*
```typescript
export const tables = {
  users: defineTable({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    twoFactorEnabled: v.optional(v.boolean()),
  }).index("by_email", ["email"]),
  
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  }).index("by_token", ["token"]),

  accounts: defineTable({
    userId: v.id("users"),
    accountId: v.string(),
    providerId: v.string(),
    accessToken: v.optional(v.string()),
  }).index("by_provider", ["providerId", "accountId"]),

  // MFA & Passkeys
  passkeys: defineTable({
    userId: v.id("users"),
    publicKey: v.string(),
    credentialID: v.string(),
    counter: v.number(),
    deviceType: v.string(),
    backedUp: v.boolean(),
    transports: v.optional(v.string()),
  }).index("by_user", ["userId"]),
  
  twoFactor: defineTable({
    userId: v.id("users"),
    secret: v.string(),
    backupCodes: v.string(), // Encrypted or delimited
  }).index("by_user", ["userId"]),
};
```

#### `module.api.ts`
- `generatePasskeyChallenge`: Action (Better Auth wrapper).
- `verifyPasskey`: Action.
- `enableMFA`: Mutation.
- `getSession`: Query (resolves session + user).

---

### Module B: Billing-Usage (Monetization)
**Purpose:** Metered billing and credit systems via Polar.sh.
**Config:** `{"id": "billing-usage", "env": ["POLAR_ACCESS_TOKEN"], "listensTo": {"auth.user_created": "api:createCustomer"}}`

#### `module.schema.ts`
```typescript
export const tables = {
  // Syncs with Polar's customer credits
  credits: defineTable({
    entityId: v.union(v.id("users"), v.id("organizations")),
    balance: v.number(),
    currency: v.string(),
    lastSyncedAt: v.number(),
  }).index("by_entity", ["entityId"]),

  // Local log for metered events before flush
  usageEvents: defineTable({
    entityId: v.union(v.id("users"), v.id("organizations")),
    metricName: v.string(), // e.g., "ai_tokens"
    amount: v.number(),
    status: v.union(v.literal("pending"), v.literal("flushed")),
  }).index("by_status", ["status"]),
};
```

#### `module.api.ts`
- `reportUsage`: Mutation (Internal: logs event to `usageEvents`).
- `flushUsage`: Action (Cron job: aggregates pending events and pushes to Polar API).
- `grantCredits`: Action (Calls Polar API to issue promotional credits).
- `syncBalance`: Action (Fetches current credit balance from Polar).

#### `module.ui/`
- `CreditBalance.svelte`: Shows current credits.
- `UsageHistory.svelte`: Graph of consumption.

---

### Module C: Notify-Flow (Communication)
**Purpose:** Transactional emails (Resend) and Push (Firebase FCM).
**Config:** `{"id": "notify-flow", "env": ["RESEND_API_KEY", "FCM_SERVER_KEY"], "listensTo": {"*": "api:handleSystemEvent"}}`

#### `module.schema.ts`
```typescript
export const tables = {
  pushTokens: defineTable({
    userId: v.id("users"),
    token: v.string(), // FCM Token
    deviceType: v.union(v.literal("ios"), v.literal("android"), v.literal("web")),
    lastUsedAt: v.number(),
  }).index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.id("users"),
    channel: v.union(v.literal("email"), v.literal("push"), v.literal("in-app")),
    templateId: v.string(),
    status: v.union(v.literal("queued"), v.literal("sent"), v.literal("failed")),
    metadata: v.optional(v.any()), // JSON payload
  }).index("by_user", ["userId"]),
};
```

#### `module.api.ts`
- `sendEmail`: Action (Resend wrapper).
- `sendPush`: Action (FCM wrapper).
- `registerPushToken`: Mutation.
- `broadcast`: Action (Fan-out to multiple users).

---

### Module D: AI-Logic (Intelligence)
**Purpose:** Streaming LLM calls and Vector Search.
**Config:** `{"id": "ai-logic", "env": ["OPENAI_API_KEY"]}`

#### `module.schema.ts`
```typescript
export const tables = {
  // Vector storage for RAG
  documents: defineTable({
    content: v.string(),
    metadata: v.any(),
    embedding: v.array(v.number()), // Vector field
  }).vectorIndex("by_embedding", {
    vectorField: "embedding",
    dimensions: 1536, // OpenAI standard
  }),

  // Streaming state for UI
  generations: defineTable({
    prompt: v.string(),
    response: v.string(),
    status: v.union(v.literal("generating"), v.literal("complete"), v.literal("failed")),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
};
```

#### `module.api.ts`
- `streamResponse`: Action (Streams LLM chunks to `generations` table via mutations).
- `searchVectors`: Action (Performs cosine similarity search via `ctx.vectorSearch`).
- `ingestDocument`: Action (Generates embedding and stores doc).

#### `module.ui/`
- `StreamingText.svelte`: Renders markdown as it streams.
- `SemanticSearch.svelte`: Search bar using vector backend.

---

### Module E: Metrics-Core (Analytics)
**Purpose:** Event tracking and Session Replay via PostHog.
**Config:** `{"id": "metrics-core", "env": ["POSTHOG_API_KEY", "POSTHOG_HOST"]}`

#### `module.schema.ts`
*Metrics-Core is primarily external, but stores mapping state.*
```typescript
export const tables = {
  // Mapping internal IDs to PostHog distinct IDs if needed
  identityMap: defineTable({
    userId: v.id("users"),
    distinctId: v.string(),
    firstSeen: v.number(),
  }).index("by_user", ["userId"]),
};
```

#### `module.api.ts`
- `trackServerEvent`: Action (Node.js PostHog client event).
- `identifyUser`: Action (Link user ID to PostHog).
- `getFeatureFlag`: Action (Fetch flags for backend logic).

#### `module.ui/`
- `PostHogProvider.svelte`: Initializes `posthog-js` with session recording enabled.
- `FeatureGate.svelte`: UI wrapper for feature flags.

---

## 4. Implementation Plan (CLI Merging Logic)
*Unchanged from V1.0*
