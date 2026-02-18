import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	// Load all environment variables from .env files
	const env = loadEnv(mode, process.cwd(), '');
	
	// Make them available in process.env for libraries like Better Auth
	// when running in the SvelteKit server runtime (dev and build)
	Object.assign(process.env, env);
	process.env.PUBLIC_CONVEX_URL ??= 'http://127.0.0.1:3210';
	process.env.PUBLIC_CONVEX_SITE_URL ??= 'http://127.0.0.1:3211';
	process.env.SITE_URL ??= 'http://localhost:5173';

	return {
		plugins: [tailwindcss(), sveltekit()]
	};
});
