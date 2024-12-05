import { writable } from "svelte/store";

export const isAuthenticated = writable(false);
export let experience = writable(0);
export let username = writable("Guest");