import type { Handle } from "@sveltejs/kit";
import { createAuth } from "$convex/auth.js";
import { getToken } from '@mmailaender/convex-better-auth-svelte/sveltekit';
import { env } from '$env/dynamic/private';

// Polyfill process.env for Convex auth config compatibility
if (typeof process !== 'undefined') {
    Object.assign(process.env, env);
}

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.token = await getToken(createAuth, event.cookies);

  return resolve(event);
};
