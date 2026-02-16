<script lang="ts">
    import { authClient } from '$lib/auth-client';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Card from "$lib/components/ui/card";

    let showSignIn = $state(true);
    let name = $state('');
    let email = $state('');
    let password = $state('');
    let error = $state('');
    let isLoading = $state(false);

    async function handlePasswordSubmit(event: Event) {
        event.preventDefault();
        error = '';
        isLoading = true;

        try {
            if (showSignIn) {
                await authClient.signIn.email(
                    { email, password },
                    {
                        onSuccess: () => goto(`${base}/onboarding`),
                        onError: (ctx) => {
                            error = ctx.error.message;
                        }
                    }
                );
            } else {
                await authClient.signUp.email(
                    { name, email, password },
                    {
                        onSuccess: () => goto(`${base}/onboarding`),
                        onError: (ctx) => {
                             error = ctx.error.message;
                        }
                    }
                );
            }
        } catch (e: any) {
            console.error('Authentication error:', e);
            error = e.message || 'An error occurred';
        } finally {
            isLoading = false;
        }
    }

    function toggleSignMode() {
        showSignIn = !showSignIn;
        name = '';
        email = '';
        password = '';
        error = '';
    }
</script>

<div class="flex h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
    <Card.Root class="w-full max-w-md">
        <Card.Header>
            <Card.Title class="text-2xl text-center">{showSignIn ? 'Sign In' : 'Sign Up'}</Card.Title>
            <Card.Description class="text-center">
                {showSignIn ? "Enter your credentials to access your account" : "Create a new account to get started"}
            </Card.Description>
        </Card.Header>
        <Card.Content>
            {#if error}
                <div class="mb-4 p-3 text-sm text-red-600 bg-red-100 rounded-md">
                    {error}
                </div>
            {/if}

            <form onsubmit={handlePasswordSubmit} class="flex flex-col gap-4">
                {#if !showSignIn}
                    <div class="flex flex-col gap-2">
                        <Label for="name">Name</Label>
                        <Input id="name" type="text" bind:value={name} placeholder="Name" required />
                    </div>
                {/if}
                <div class="flex flex-col gap-2">
                    <Label for="email">Email</Label>
                    <Input id="email" type="email" bind:value={email} placeholder="Email" required />
                </div>
                <div class="flex flex-col gap-2">
                    <Label for="password">Password</Label>
                    <Input id="password" type="password" bind:value={password} placeholder="Password" required />
                </div>
                <Button type="submit" class="w-full" disabled={isLoading}>
                    {isLoading ? 'Loading...' : (showSignIn ? 'Sign in' : 'Sign up')}
                </Button>
            </form>
        </Card.Content>
        <Card.Footer class="justify-center">
            <p class="text-sm text-muted-foreground">
                {showSignIn ? "Don't have an account? " : 'Already have an account? '}
                <button
                    type="button"
                    onclick={toggleSignMode}
                    class="text-primary underline hover:text-primary/80 bg-transparent border-none cursor-pointer"
                >
                    {showSignIn ? 'Sign up' : 'Sign in'}
                </button>
            </p>
        </Card.Footer>
    </Card.Root>
</div>
