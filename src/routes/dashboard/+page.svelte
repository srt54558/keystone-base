<script lang="ts">
  import { useAuth } from "@mmailaender/convex-better-auth-svelte/svelte";
  import { api } from "$convex/_generated/api";
  import { useQuery } from "convex-svelte";
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";

  const auth = useAuth();
  const isAuthenticated = $derived(auth.isAuthenticated);
  const isLoading = $derived(auth.isLoading);

  const userQuery = useQuery(api.auth.getCurrentUser, () => (isAuthenticated ? {} : "skip"));
  const user = $derived(userQuery.data);

  async function signOut() {
      await authClient.signOut();
      await goto(`${base}/signin`);
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
  {#if isLoading}
    <p class="text-center">Loading...</p>
  {:else if !isAuthenticated}
    <div class="text-center">
        <p class="mb-4">You must be logged in to view this page.</p>
        <Button href="{base}/signin" variant="link">Sign In</Button>
    </div>
  {:else}
    <div class="max-w-4xl mx-auto space-y-6">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold">Dashboard</h1>
            <Button variant="destructive" onclick={signOut}>Sign Out</Button>
        </div>

        <Card.Root>
            <Card.Header>
                <Card.Title>User Profile</Card.Title>
            </Card.Header>
            <Card.Content>
                <pre class="bg-muted p-4 rounded-md overflow-auto text-xs">{JSON.stringify(user, null, 2)}</pre>
            </Card.Content>
        </Card.Root>

        <Card.Root>
            <Card.Header>
                <Card.Title>Subscription</Card.Title>
                <Card.Description>Manage your subscription and billing</Card.Description>
            </Card.Header>
            <Card.Content class="flex gap-4">
                <Button href="{base}/checkout" variant="default">Subscribe</Button>
                <Button href="{base}/portal" variant="secondary">Manage Subscription</Button>
            </Card.Content>
        </Card.Root>
    </div>
  {/if}
</div>
