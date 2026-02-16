import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.token) {
    // User is logged in, check if they have blueprints
    // For now, just redirect to onboarding or dashboard
    throw redirect(303, "/onboarding");
  }
  return {};
};
