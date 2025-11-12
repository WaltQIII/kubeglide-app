<!-- File: frontend/src/Register.svelte -->
<script>
  import { user, jwt } from './store.js';

  let username = '';
  let email = '';
  let password = '';
  let error = '';

  const strapiUrl = 'http://localhost:1337';

  async function handleRegister() {
    error = '';
    try {
      const response = await fetch(`${strapiUrl}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Registration failed');
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
  <h2 class="text-2xl font-bold text-white mb-6">Register</h2>
  <form on:submit|preventDefault={handleRegister}>
    <div class="mb-4">
      <label class="block text-gray-300 mb-2" for="register-username">Username</label>
      <input bind:value={username} type="text" id="register-username" class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" required />
    </div>
     <div class="mb-4">
      <label class="block text-gray-300 mb-2" for="register-email">Email</label>
      <input bind:value={email} type="email" id="register-email" class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" required />
    </div>
    <div class="mb-6">
      <label class="block text-gray-300 mb-2" for="register-password">Password</label>
      <input bind:value={password} type="password" id="register-password" class="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" required />
    </div>
    <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-200">
      Sign Up
    </button>
    {#if error}
      <p class="text-red-500 mt-4">{error}</p>
    {/if}
  </form>
</div>
