<script>
	import { onMount } from 'svelte';

	let workspaces = [];

	onMount(async () => {
		const response = await fetch('http://localhost:1337/api/workspaces');
		const json = await response.json();
		workspaces = json.data;
	});
</script>

<main class="min-h-screen bg-gray-900 text-white p-8">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-4xl font-bold mb-8 text-blue-400">KubeGlide</h1>

		<div class="mb-4 text-xl font-semibold text-gray-300">Workspaces:</div>

		<div class="space-y-4">
			{#each workspaces as workspace}
				<div class="bg-gray-800 rounded-lg p-6 shadow-lg hover:bg-gray-700 transition-colors">
					<h2 class="text-lg font-medium text-white">{workspace.attributes.name}</h2>
				</div>
			{/each}
		</div>
	</div>
</main>
