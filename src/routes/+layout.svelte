<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { authClient } from '$lib/auth-client';
	import { page } from '$app/stores';
	import { setupConvex } from 'convex-svelte';
	import { env } from '$env/dynamic/public';

	let { children, data } = $props();

	setupConvex(env.PUBLIC_CONVEX_URL ?? 'http://127.0.0.1:3210');

	createSvelteAuthClient({
		authClient,
		getServerState: () => data.authState
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="relative min-h-screen flex flex-col">
    <div class="flex-1">
        {@render children()}
    </div>
    
    {#if !$page.url.pathname.startsWith('/prototype') && !$page.url.pathname.startsWith('/onboarding')}
    <footer class="w-full py-6 text-center text-[10px] font-sans uppercase tracking-widest text-zinc-500 opacity-30 relative z-0 pointer-events-none">
        <div class="inline-flex gap-4 pointer-events-auto">
            <span>&copy; {new Date().getFullYear()} K+</span>
            <span>&bull;</span>
	            <a href="https://k-plus.one/privacy" class="hover:text-primary transition-colors">Privacy</a>
	        </div>
	    </footer>
    {/if}
</div>
