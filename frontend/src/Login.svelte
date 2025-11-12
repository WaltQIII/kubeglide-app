<!-- File: frontend/src/Login.svelte -->
<script>
  import { user, jwt } from './store.js';

  let identifier = ''; // This can be username or email
  let password = '';
  let error = '';

  const strapiUrl = 'http://localhost:1337';

  async function handleLogin() {
    error = '';
    try {
      const response = await fetch(`${strapiUrl}/api/auth/local`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      // Update the store
      $user = data.user;
      $jwt = data.jwt;

    } catch (err) {
      error = err.message;
    }
  }
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-xl">
  <h2 class="text-2xl font-bold text-white mb-6">Login</h2>
  <form on:submit|preventDefault={handleLogin}>
    <div class="mb-4">
      <label class="block text-gray-300 mb-2" for="login-identifier">Email or Username</label>
      <input bind:value={identifier} type="text" id="login-identifier" class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" required />
    </div>
    <div class="mb-6">
      <label class="block text-gray-300 mb-2" for="login-password">Password</label>
      <input bind:value={password} type="password" id="login-password" class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" required />
    </div>
    <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
      Log In
    </button>
    {#if error}
      <p class="text-red-500 mt-4">{error}</p>
    {/if}
  </form>
</div>
