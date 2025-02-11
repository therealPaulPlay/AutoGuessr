import { readable } from "svelte/store";

// API Config
export const baseUrl = readable("https://cars.autoguessr.com");
export const accountUrl = readable("https://accounts.openguessr.com");