import { CustomerPortal } from "@polar-sh/sveltekit";
import { POLAR_ACCESS_TOKEN, POLAR_MODE } from "$env/static/private";
import { redirect } from "@sveltejs/kit";
import { createConvexHttpClient } from "@mmailaender/convex-better-auth-svelte/sveltekit";
import { api } from "$convex/_generated/api";

export const GET = async (event: any) => {
    if (!event.locals.token) {
        throw redirect(302, '/signin');
    }

    // We can't really "check" the result of getCustomerId inside the Checkout/CustomerPortal helper
    // because it's a callback.
    // However, the helper might fail if we return empty.

    // Better approach: Check the ID *before* calling CustomerPortal if possible?
    // No, CustomerPortal is the handler.

    // We can wrap the getCustomerId to redirect if empty?
    // The library expects a string.

    // Alternative: We check beforehand.
    const client = createConvexHttpClient({ token: event.locals.token });
    const user = await client.query(api.users.getMe, {});

    if (!user?.polarCustomerId) {
        // User has no subscription/customer ID.
        // Redirect to checkout or dashboard.
        throw redirect(302, '/checkout');
    }

    return CustomerPortal({
        accessToken: POLAR_ACCESS_TOKEN,
        server: POLAR_MODE === 'production' ? 'production' : 'sandbox',
        getCustomerId: async (_event) => {
            return user.polarCustomerId!;
        },
    })(event);
};
