<script lang="ts">
    import { authClient } from '$lib/auth-client';
    import { Github, Mail, ArrowRight, Loader2, Check } from 'lucide-svelte';
    import { fade, fly } from 'svelte/transition';

    let email = $state('');
    let isLoading = $state(false);
    let isSuccess = $state(false);
    let error = $state('');

    async function handleGithubLogin() {
        isLoading = true;
        await authClient.signIn.social({
            provider: 'github',
            callbackURL: '/onboarding'
        });
        // Note: Redirect happens automatically, but we keep loading state
    }

    async function handleMagicLink() {
        if (!email) return;
        isLoading = true;
        error = '';
        
        try {
            await authClient.signIn.magicLink({
                email,
                callbackURL: '/onboarding'
            });
            isSuccess = true;
        } catch (e: any) {
            error = e.message || 'Failed to send magic link';
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="fixed inset-0 w-full h-full bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
    <!-- Background -->
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
    
    <div class="w-full max-w-md relative z-10">
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold tracking-tight text-white mb-2">Initialize Session</h1>
            <p class="text-zinc-400">Authenticate to access the Architect Workspace.</p>
        </div>

        <div class="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl backdrop-blur-sm shadow-2xl">
            {#if isSuccess}
                <div class="text-center py-8" in:fade>
                    <div class="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <Check size={32} />
                    </div>
                    <h3 class="text-xl font-bold text-white mb-2">Check your inbox</h3>
                    <p class="text-zinc-400 mb-6">We sent a magic link to <span class="text-zinc-200 font-mono">{email}</span></p>
                    <button 
                        onclick={() => isSuccess = false}
                        class="text-sm text-zinc-500 hover:text-zinc-300 underline"
                    >
                        Use a different email
                    </button>
                </div>
            {:else}
                <div class="space-y-4" in:fade>
                    <button 
                        onclick={handleGithubLogin}
                        disabled={isLoading}
                        class="w-full h-12 bg-white text-black font-bold rounded-lg flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {#if isLoading}
                            <Loader2 size={20} class="animate-spin" />
                        {:else}
                            <Github size={20} />
                            <span>Continue with GitHub</span>
                        {/if}
                    </button>

                    <div class="relative py-4">
                        <div class="absolute inset-0 flex items-center">
                            <span class="w-full border-t border-zinc-800"></span>
                        </div>
                        <div class="relative flex justify-center text-xs uppercase">
                            <span class="bg-zinc-900 px-2 text-zinc-500">Or continue with email</span>
                        </div>
                    </div>

                    <form 
                        class="space-y-4"
                        onsubmit={(e) => { e.preventDefault(); handleMagicLink(); }}
                    >
                        <div>
                            <label for="email" class="sr-only">Email address</label>
                            <input 
                                id="email"
                                type="email" 
                                bind:value={email}
                                placeholder="name@example.com"
                                class="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-lg px-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        
                        {#if error}
                            <div class="text-red-400 text-xs px-1" transition:fly={{ y: -10 }}>
                                {error}
                            </div>
                        {/if}

                        <button 
                            type="submit"
                            disabled={isLoading || !email}
                            class="w-full h-12 bg-zinc-800 text-zinc-200 font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-700"
                        >
                            {#if isLoading && email}
                                <Loader2 size={18} class="animate-spin" />
                            {:else}
                                <Mail size={18} />
                                <span>Send Magic Link</span>
                            {/if}
                        </button>
                    </form>
                </div>
            {/if}
        </div>
        
        <p class="mt-8 text-center text-xs text-zinc-600">
            By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
    </div>
</div>
