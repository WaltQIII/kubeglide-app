<!-- File: frontend/src/App.svelte (OVERWRITE) -->
<script>
  import { onMount } from 'svelte';
  import { isLoggedIn, user, jwt, logout } from './store.js';
  import Login from './Login.svelte';
  import Register from './Register.svelte';

  let workspaces = [];
  let loading = false;
  let error = '';
  let showLogin = true; // Toggle between Login and Register forms

  const strapiUrl = 'http://localhost:1337';

  // Function to fetch workspaces
  async function fetchWorkspaces() {
    if (!$isLoggedIn) return; // Guard clause

    loading = true;
    error = '';
    try {
      const response = await fetch(`${strapiUrl}/api/workspaces`, {
        headers: {
          'Authorization': `Bearer ${$jwt}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workspaces. Are you logged in?');
      }

      const jsonData = await response.json();
      workspaces = jsonData.data; // Strapi V4 data wrapper
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  // When `isLoggedIn` changes to true, fetch workspaces
  $: if ($isLoggedIn) {
    fetchWorkspaces();
  }
</script>

<main class="min-h-screen bg-gray-900 text-gray-100 p-8">
  <div class="container mx-auto">

    {#if $isLoggedIn}
      <!-- LOGGED-IN VIEW -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-4xl font-bold">KubeGlide</h1>
        <div class="flex items-center">
          <span class="mr-4">Welcome, {$user?.username}!</span>
          <button on:click={logout} class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200">
            Logout
          </button>
        </div>
      </div>

      <h2 class="text-2xl mb-4">Your Workspaces:</h2>

      {#if loading}
        <p>Loading workspaces...</p>
      {:else if error}
        <p class="text-red-500">{error}</p>
      {:else if workspaces.length === 0}
        <p class="text-gray-400">No workspaces found. Create your first one!</p>
      {:else}
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {#each workspaces as workspace (workspace.id)}
            <li class="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition duration-200">
              <h3 class="text-xl font-semibold text-blue-400">{workspace.attributes.name}</h3>
            </li>
          {/each}
        </ul>
      {/if}

    {:else}
      <!-- LOGGED-OUT VIEW -->
      <h1 class="text-4xl font-bold text-center mb-10">Welcome to KubeGlide</h1>

      {#if showLogin}
        <Login />
        <p class="text-center mt-4">
          Don't have an account?
          <button on:click={() => showLogin = false} class="text-blue-400 hover:underline">Register here</button>
        </p>
      {:else}
        <Register />
        <p class="text-center mt-4">
          Already have an account?
          <button on:click={() => showLogin = true} class="text-blue-400 hover:underline">Login here</button>
        </p>
      {/if}
    {/if}

  </div>
</main>
