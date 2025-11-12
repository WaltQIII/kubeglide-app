<script>
	import { onMount } from 'svelte';

	let workspaces = [];
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:1337/api/workspaces');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const json = await response.json();
			workspaces = json.data;
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

<main class="min-h-screen bg-gray-900 text-white p-8">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-4xl font-bold mb-8 text-blue-400">KubeGlide Workspaces</h1>

		{#if loading}
			<div class="text-center py-8">
				<div class="text-xl text-gray-400">Loading workspaces...</div>
			</div>
		{:else if error}
			<div class="bg-red-900 border border-red-700 text-red-200 rounded-lg p-6">
				<h2 class="text-lg font-semibold mb-2">Error loading workspaces</h2>
				<p>{error}</p>
			</div>
		{:else}
			<div class="mb-4 text-xl font-semibold text-gray-300">Workspaces:</div>

			<div class="space-y-4">
				{#each workspaces as workspace}
					<div class="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 transition-colors">
						<h2 class="text-lg font-medium text-white">{workspace.attributes.name}</h2>
					</div>
				{:else}
					<div class="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
						No workspaces found
					</div>
				{/each}
			</div>
		{/if}
	</div>
</main>
