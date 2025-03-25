import { writable } from "svelte/store";

export const multiplayerCurrentScreen = writable(false);
export const multiplayerFlag = writable(false);
export const gameInProgressFlag = writable(false);
export const inGame = writable(false);
export const gameRestartedFlag = writable(false);
export const multiplayerQuestionsList = writable([]);
export const currentPlayers = writable([]);
export const playersInGame = writable([]);
export const roomId = writable();
export const peer = writable();
export const peerStatusStore = writable();