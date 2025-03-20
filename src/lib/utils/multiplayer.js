import PlayPeer from "playpeerjs";
import {
	currentPlayers,
	multiplayerFlag,
	roomId,
	peerStore,
	peerStatusStore,
	gameInProgressFlag,
	inGame,
} from "$lib/stores/multiplayerStore";
import { get } from "svelte/store";
import { totalCarAmount } from "$lib/stores/gameStore";
import { getTotalCarDataAmount } from "./gameFunctions";

let peer;
let peerId;

export async function handleHostStart() {
	await host();
	return peerId; // host id
}

export async function handleJoinRoom(roomId) {
	if (!roomId) return alert("Please enter the Room code (Host ID)");

	try {
		if (!peer) await initPeer();
		await peer.joinRoom(`autoguessr_${roomId.toLowerCase()}`);
		multiplayerFlag.set(true);
	} catch (error) {
		alert("Failed to join: " + error.message);
	}
}

export async function getRoomCodeFromPeerId(peerId) {
	let string = await peerId;
	const parts = string.split("_");
	if (parts.length > 1) {
		return parts[1];
	}
	return "";
}

export function leaveMultiplayerRoom() {
	if (!peer) return;
	peer.destroy();
	peer = null;
	roomId.set("");
	multiplayerFlag.set(false);
}

function generateRoomCode() {
	let randomString = "";
	for (let i = 0; i < 6; i++) {
		const randomCharCode = Math.floor(Math.random() * 26) + 97;
		randomString += String.fromCharCode(randomCharCode);
	}
	return randomString;
}

async function initPeer() {
	peerId = `autoguessr_${generateRoomCode()}`;
	peer = new PlayPeer(peerId, {
		config: {
			iceServers: [
				{ urls: "stun:stun.l.google.com:19302" },
				{ urls: "turn:freestun.net:3478", username: "free", credential: "free" }, // For production, use fastturn, or a different turn server
			],
		},
	});

	peerStore.set(peer);

	peer.onEvent("status", (status) => {
		peerStatusStore.set(status);
	});
	peer.onEvent("storageUpdated", (storage) => {
		currentPlayers.set(storage.players);

		if (get(gameInProgressFlag) != storage.gameInProgress) {
			gameInProgressFlag.set(storage.gameInProgress);
		}

		const playerInfo = getPlayerInfo(peer.id);
		if (playerInfo && get(inGame) !== playerInfo.inGame) {
			inGame.set(playerInfo.inGame);
		}

		checkQuestionsArray(storage.players, storage.questionsIds);
		console.log("storage update:", storage);
	});

	// For host: When a peer is connected to the host
	peer.onEvent("incomingPeerConnected", (newPeerId) => {
		peer.updateStorageArray("players", "add-unique", { id: newPeerId, score: -1, inGame: false });
	});
	peer.onEvent("incomingPeerDisconnected", (disconnectedPeerId) => {
		peer.updateStorageArray("players", "remove-matching", { id: disconnectedPeerId });
	});

	// For peer: When peer connects/discconects from host
	peer.onEvent("outgoingPeerDisconnected", (disconnectedPeerId) => {
		peer.updateStorageArray("players", "remove-matching", { id: disconnectedPeerId });
	});

	await peer.init();
}

async function host() {
	try {
		if (!peer) await initPeer();
	} catch (error) {
		console.error("Error occurred in host function:", error);
	}
	await peer.createRoom({ players: [], gameInProgress: false, questionsIds: [] });
	if (peer.isHost) {
		peer.updateStorageArray("players", "add-unique", { id: peer.id, score: -1, inGame: false });
		multiplayerFlag.set(true);
	}
}

async function checkQuestionsArray(playersArray, questionsArray) {
	// Insure the function runs only for host, that way we don't have this function run multiple times for each peer
	if (!peer.isHost) return;

	let questionMargin = 3;
	let currentMaxScore = maxScore(playersArray);
	let availableIndecies = await getTotalCarDataAmount();
	let addedQuestions = [];

	// if the difference between the current max score and questions array
	// is higher than the question margin then it'll return
	if (questionsArray.length > currentMaxScore + questionMargin) return;

	for (let i = 0; i < questionMargin; i++) {
		addedQuestions.push(Math.floor(Math.random() * availableIndecies));
	}

	let newQuestionArray = [...questionsArray, ...addedQuestions];

	peer.updateStorage("questionsIds", newQuestionArray);
}

function maxScore(array) {
	let maxScore = -1;
	for (const item of array) {
		if (item.score > maxScore) {
			maxScore = item.score;
		}
	}
	return maxScore;
}

export function getPlayerInfo(id) {
	try {
		if (!peer) {
			return null;
		}

		// Find the player object with the matching id
		return peer.getStorage.players.find((obj) => obj.id === id) || null;
	} catch (error) {
		console.error("Error occurred in getPlayerInfo function:", error);
		throw error; // Re-throw the error for other unexpected issues
	}
}

export function updatePlayerScore(playerId, newScore) {
	console.log("updatePlayerScore called");
	try {
		if (!peer) {
			return null;
		}

		let playerInfo = getPlayerInfo(playerId);
		peer.updateStorageArray(
			"players",
			"update-matching",
			{ id: playerId, score: playerInfo.score, inGame: playerInfo.inGame },
			{ id: playerId, score: newScore, inGame: playerInfo.inGame },
		);
		console.log("updatePlayerScore got all the way");
	} catch (error) {
		console.error("Error occurred in updatePlayerScore function:", error);
		throw error;
	}
}
