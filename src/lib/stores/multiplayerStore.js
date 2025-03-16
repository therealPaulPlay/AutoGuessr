import { writable } from "svelte/store";

export const MultiplayerPopupBody = writable(false);
export const MultiplayerCurrentScreen = writable(false);
export const CurrentPlayers = writable([]);
export const roomId = writable([]);