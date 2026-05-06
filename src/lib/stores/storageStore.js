import { writable } from "svelte/store";

// Storage
export const highscore = writable(0);
export const userCards = writable([]);