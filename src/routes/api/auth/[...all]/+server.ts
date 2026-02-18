import { env } from '$env/dynamic/public';
import { createSvelteKitHandler } from '@mmailaender/convex-better-auth-svelte/sveltekit';

export const { GET, POST } = createSvelteKitHandler({
  convexSiteUrl: env.PUBLIC_CONVEX_SITE_URL ?? 'http://127.0.0.1:3211',
});
