import { writable } from "svelte/store";

// Popups
export const settingsPopup = writable(false);
export const signupPopup = writable(false);
export const accountPopup = writable(false);
export const errorPopup = writable(false);
export const leavePopup = writable(false);

// Misc calculations
export const windowWidth = writable(1200);

// Texts
export const errorText = writable("");