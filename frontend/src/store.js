// File: frontend/src/store.js
import { writable } from 'svelte/store';

// Get user from localStorage if it exists
const storedUser = localStorage.getItem('kubeglide_user');
const storedJwt = localStorage.getItem('kubeglide_jwt');

// Create writable stores
export const user = writable(storedUser ? JSON.parse(storedUser) : null);
export const jwt = writable(storedJwt ? storedJwt : null);
export const isLoggedIn = writable(storedUser ? true : false);

// Update localStorage when stores change
user.subscribe(value => {
  if (value) {
    localStorage.setItem('kubeglide_user', JSON.stringify(value));
  } else {
    localStorage.removeItem('kubeglide_user');
  }
});

jwt.subscribe(value => {
  if (value) {
    localStorage.setItem('kubeglide_jwt', value);
    isLoggedIn.set(true);
  } else {
    localStorage.removeItem('kubeglide_jwt');
    isLoggedIn.set(false);
  }
});

// Helper function for logout
export const logout = () => {
  user.set(null);
  jwt.set(null);
};
