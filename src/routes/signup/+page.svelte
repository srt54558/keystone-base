<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="fixed inset-0 w-full h-full bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
	<div class="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl space-y-3">
		<h1 class="text-2xl font-bold">Sign Up</h1>
		<p class="text-sm text-zinc-400">
			This is the base skeleton. Authentication flow is generated from module configuration during init.
		</p>
		<a href={resolve('/')} class="inline-block text-sm text-zinc-300 hover:text-white underline">Back to home</a>
	</div>
</div>
