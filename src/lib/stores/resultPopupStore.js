import { writable } from "svelte/store";

export const penaltyFlag = writable(false);
export const rewardFlag = writable(false);

export const blinkingFlag = writable(false);
export const livesImage = writable(0);

export const popupMessage = writable("No message.");