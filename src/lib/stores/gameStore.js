import { writable } from "svelte/store";

export const difficulty = writable(1);
export const lives = writable(3);