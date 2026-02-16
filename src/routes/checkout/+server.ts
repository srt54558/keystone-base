import { Checkout } from "@polar-sh/sveltekit";
import { POLAR_ACCESS_TOKEN, POLAR_SUCCESS_URL, POLAR_MODE } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export const GET = async (event: any) => {
    if (!event.locals.token) {
        throw redirect(302, '/signin');
    }

    // TODO: Get user email from DB to pre-fill if possible, but requires DB call.
    // For now, just ensuring auth is present.

    return Checkout({
        accessToken: POLAR_ACCESS_TOKEN,
        successUrl: POLAR_SUCCESS_URL ?? "http://localhost:5173/dashboard",
        server: POLAR_MODE === 'production' ? 'production' : 'sandbox',
    })(event);
};
