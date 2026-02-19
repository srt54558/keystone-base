# Keystone Base (The Lego Plate)

**"Full control, zero tech-debt, worst part gone."**

This is the **generic, unopinionated foundation** for all Keystone V2 projects. It is a "Lego Plate"—a clean, high-performance surface ready for you to snap modules onto.

**ZERO Monetization. ZERO Business Logic. ZERO Fluff.**

## 🏗 Stack

- **Framework:** SvelteKit + Svelte 5 (Runes)
- **Styling:** Tailwind CSS 4.0
- **Backend:** Convex (Realtime Database + Functions)
- **Auth:** Better Auth (with Convex adapter)
- **Linting:** Biome + ESLint (inc. `@convex-dev/eslint-plugin`)

## ⚡ Quick Start

1. **Clone & Install**
   ```bash
   npx @kplus/keystone create my-app
   cd my-app
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   *Generate `BETTER_AUTH_SECRET` with `openssl rand -base64 32`.*

3. **Ignition**
   ```bash
   npx convex dev
   npm run dev
   ```

## 🧩 The Philosophy

This repository is **intentionally empty** of business features. It provides:

1.  **Authentication:** A pre-wired `users` table synced with Better Auth.
2.  **Type Safety:** End-to-end TypeScript from database to UI.
3.  **Gold Standard Linting:** Hardcoded rules to prevent "AI Slop" and reactivity errors.

### Injecting Modules
Do not build billing, invoices, or complex teams from scratch. Use the **Keystone CLI** to inject specialized, pre-validated modules into this base.

```bash
# Example: Inject the billing engine (Polar.sh)
npx @kplus/keystone add billing
```

## 📂 Structure

- `src/convex/schema.ts` → **Minimal.** Only the `users` table exists.
- `src/convex/auth.ts` → **Clean.** Authentication logic without SaaS hooks.
- `src/convex/users.ts` → **Synced.** Automatically manages user identity.

---
*Built for the Keystone Architecture.*
