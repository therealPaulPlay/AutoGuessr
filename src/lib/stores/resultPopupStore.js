import { derived, writable } from "svelte/store";
import { lives } from "./gameStore";

export const penaltyFlag = writable(false);
export const rewardFlag = writable(false);

export const blinkingFlag = derived(lives, $lives => $lives == 3);
export const livesImage = writable(0);

export const popupMessage = writable("No message.");