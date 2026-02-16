# Keystone Base

The gold-standard modular skeleton for Keystone projects. Built with Svelte 5 (Runes), Convex, Tailwind 4, and Better Auth.

## 🏗 Architecture

This is a clean slate. All Keystone-specific "Theater" logic has been stripped, leaving only the high-performance core:

- **Frontend:** SvelteKit + Svelte 5 Runes
- **Styling:** Tailwind CSS 4.0
- **Backend:** Convex (Realtime DB + Functions)
- **Auth:** Better Auth (with Convex adapter)
- **SaaS:** Polar.sh integration ready (Webhooks + API)

## 🚀 Getting Started

1. **Clone & Install**
   ```bash
   git clone https://github.com/srt54558/keystone-base.git my-app
   cd my-app
   npm install
   ```

2. **Environment Setup**
   Copy the example env:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your keys:
   - `CONVEX_DEPLOYMENT` / `VITE_CONVEX_URL`: Run `npx convex dev` to generate these.
   - `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`.
   - `POLAR_*`: From your Polar.sh dashboard (if using SaaS features).

3. **Run Development**
   ```bash
   npx convex dev
   npm run dev
   ```

## 🧩 Modularity

This base is designed to accept Keystone Modules. 

- **Schema:** `src/convex/schema.ts` is minimal. Add your tables there.
- **Auth:** `src/convex/auth.ts` and `src/convex/users.ts` handle identity.
- **UI:** `src/lib/components/ui` contains your Shadcn-Svelte primitives.

## 🛡️ Best Practices

- **Linting:** Includes `@convex-dev/eslint-plugin` to catch reactivity and schema issues.
- **Types:** Full TypeScript support with Svelte 5 generics.
- **Security:** RLS via Convex `ctx.auth` and Better Auth policies.
