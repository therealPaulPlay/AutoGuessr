import { writable } from "svelte/store";

// Popups
export const settingsPopup = writable(false);
export const signupPopup = writable(false);
export const accountPopup = writable(false);

// Misc calculations
export const windowWidth = writable(1200);