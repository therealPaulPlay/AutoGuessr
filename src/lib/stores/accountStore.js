import { writable } from "svelte/store";

export const isAuthenticated = writable(false);
export const experience = writable(0);
export const username = writable("Guest");

// Storage
export const highscore = writable(0);
export const userCards = writable([]);