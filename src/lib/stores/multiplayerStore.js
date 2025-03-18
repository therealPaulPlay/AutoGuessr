import { writable } from "svelte/store";

export const multiplayerPopupBody = writable(false);
export const multiplayerCurrentScreen = writable(false);
export const multiplayerFlag = writable(false);
export const gameInProgressFlag = writable(false);
export const currentPlayers = writable([]);
export const roomId = writable();
export const peerStore = writable();
export const peerStatusStore = writable();