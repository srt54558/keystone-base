# KEYSTONE MODULE SYSTEM: IMPLEMENTATION REPORT

## 1. Module Specification & Hub Logic
I have designed a standardized "Lego Brick" module system and prepared the Base Repo to accept it.

### The "Module Hub" (Base Repo Updates)
- **Registry:** Created `src/lib/modules/registry.ts`. This singleton acts as the central brain, tracking active modules.
- **Unified Caller:** Components can now import `modules` from `$lib` to conditionally render UI or logic:
  ```typescript
  import { modules } from '$lib';
  if (modules.has('polar-pay')) { /* Render billing UI */ }
  ```
- **Entry Point:** Updated `src/lib/index.ts` to export the registry.

### Schema Injection Strategy
Modified `src/convex/schema.ts` to include two critical markers for the CLI:
1. `// [KEYSTONE_MODULE_IMPORTS]`: For necessary imports.
2. `// [KEYSTONE_MODULE_TABLES]`: Where the CLI will inject table definitions without breaking existing schema.

---

## 2. Core Module Definitions (Summary)
Full specs are available in `keystone-base/docs/MODULE_SPEC.md`.

### Module A: Org-Core (The Foundation)
- **Schema:** `organizations`, `members`.
- **API:** `createOrg`, `addMember`, `getOrg`.
- **UI:** `<OrgSwitcher />`, `<InviteMember />`, `<PermissionsGuard />`.

### Module B: Polar-Pay (Monetization)
- **Schema:** `subscriptions`, `webhookEvents`.
- **API:** `createCheckout`, `handleWebhook`, `getSubscription`.
- **UI:** `<PricingCards />`, `<ManageSubscription />`.
- **Dependency:** Can optionally depend on `org-core` for B2B billing.

### Module C: File-Storage (Assets)
- **Schema:** `files`.
- **API:** `generateUploadUrl`, `saveFileMetadata`.
- **UI:** `<FileUploader />`, `<FileGallery />`.

### Module D: AI-Obs (Intelligence)
- **Schema:** `aiLogs` (tokens, latency, cost).
- **API:** `logInteraction`, `getUsageStats`.
- **UI:** `<UsageChart />`, `<LogViewer />`.

---

## 3. CLI Implementation Plan
The CLI `keystone add <module>` will:
1. **Inject Schema:** Read `module.schema.ts`, stringify the `tables` object, and inject it into `src/convex/schema.ts` at the marker.
2. **Wire API:** Copy `module.api.ts` to `convex/modules/<module>/api.ts`.
3. **Install UI:** Copy `module.ui/` to `src/lib/modules/<module>/`.
4. **Register:** Append `modules.register(...)` to the registry initialization.

**Status:**
- `keystone-base/src/lib/index.ts`: UPDATED.
- `keystone-base/src/convex/schema.ts`: UPDATED.
- `keystone-base/docs/MODULE_SPEC.md`: CREATED.
- **Changes are local.** Please push to main when ready.
