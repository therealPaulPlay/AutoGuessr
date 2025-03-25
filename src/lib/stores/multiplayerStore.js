import { writable } from "svelte/store";

export const multiplayerCurrentScreen = writable(false);
export const multiplayerFlag = writable(false);
export const gameInProgressFlag = writable(false);

export const inGame = writable(false);
export const multiplayerQuestionsList = writable([]);
export const currentMatchIndex = writable(0);

// Players
export const currentPlayers = writable([]);
export const playersInGame = writable([]);

export const roomId = writable();
export const peer = writable(); // Peer instance
export const multiplayerStatus = writable(); // PlayPeerJS status