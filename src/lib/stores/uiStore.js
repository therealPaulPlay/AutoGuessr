import { writable } from "svelte/store";

// Popups
export const settingsPopup = writable(false);
export const signupPopup = writable(false);
export const accountPopup = writable(false);
export const errorPopup = writable(false);
export const leavePopup = writable(false);
export const howToPlayPopup = writable(false);
export const resultPopup = writable(false);
export const creditsPopup = writable(false);
export const multiplayerPopup = writable(false);

// Texts
export const errorText = writable("");