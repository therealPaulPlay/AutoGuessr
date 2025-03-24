import PlayPeer from "playpeerjs";
import {
	currentPlayers,
	multiplayerFlag,
	roomId,
	peerStore,
	peerStatusStore,
	gameInProgressFlag,
	inGame,
	playersInGame,
	gameRestartedFlag,
	multiplayerQuestionsList,
} from "$lib/stores/multiplayerStore";
import { get } from "svelte/store";
import { totalCarAmount } from "$lib/stores/gameStore";
import { getTotalCarDataAmount } from "./gameFunctions";
import { username } from "$lib/stores/accountStore";

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
	gameInProgressFlag.set(false);
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
	peer.onEvent("storageUpdated", async (storage) => {
		currentPlayers.set(storage.players);

		if (get(gameInProgressFlag) != storage.gameInProgress) {
			gameInProgressFlag.set(storage.gameInProgress);
		}

		if (get(gameRestartedFlag) != storage.gameRestarted) {
			gameRestartedFlag.set(storage.gameRestarted);
		}

		const playerInfo = getPlayerInfo(peer.id);
		if (playerInfo && get(inGame) !== playerInfo.inGame) {
			inGame.set(playerInfo.inGame);
		}

		const currentInGame = get(playersInGame);
		if (JSON.stringify(currentInGame) !== JSON.stringify(getInGamePlayers())) {
			playersInGame.set(getInGamePlayers());
		}

		if (maxScore(storage.players) >= storage.questionsIds.length - 3 && peer.isHost) {
			await checkQuestionsArray(storage.players, storage.questionsIds);
		}

		if (JSON.stringify(get(multiplayerQuestionsList)) !== JSON.stringify(storage.questionsIds)) {
			multiplayerQuestionsList.set(storage.questionsIds);
		}

		console.log(storage);
	});

	// For host: When a peer is connected to the host
	peer.onEvent("incomingPeerConnected", (newPeerId) => {
		// peer.updateStorageArray("players", "add-unique", {
		// 	id: newPeerId,
		// 	score: -1,
		// 	inGame: false,
		// 	name: getPlayerName(),
		// });
	});
	peer.onEvent("incomingPeerDisconnected", (disconnectedPeerId) => {
		const currentPlayerInfo = getPlayerInfo(disconnectedPeerId);
		peer.updateStorageArray("players", "remove-matching", currentPlayerInfo);
	});

	// For peer: When peer connects/discconects from host
	peer.onEvent("outgoingPeerDisconnected", (disconnectedPeerId) => {
		const currentPlayerInfo = getPlayerInfo(disconnectedPeerId);
		peer.updateStorageArray("players", "remove-matching", currentPlayerInfo);
	});
	peer.onEvent("outgoingPeerConnected", (connectedPeerId) => {
		console.log("Name should be updated");
		peer.updateStorageArray("players", "add-unique", {
			id: connectedPeerId,
			score: -1,
			inGame: false,
			name: getPlayerName(),  // Why doesn't this work?
		});
	});

	await peer.init();
}

async function host() {
	try {
		if (!peer) await initPeer();
	} catch (error) {
		console.error("Error occurred in host function:", error);
	}
	await peer.createRoom({ players: [], gameInProgress: false, gameRestarted: false, questionsIds: [] });
	if (peer.isHost) {
		peer.updateStorageArray("players", "add-unique", { id: peer.id, score: -1, inGame: false, name: getPlayerName() });
		multiplayerFlag.set(true);
	}
}

async function checkQuestionsArray(playersArray, questionsArray) {
	// Insure the function runs only for host, that way we don't have this function run multiple times for each peer
	if (!peer.isHost) return;

	const questionMargin = 3;
	const currentMaxScore = maxScore(playersArray);
	// if the difference between the current max score and questions array
	// is higher than the question margin then it'll return
	if (questionsArray.length > currentMaxScore + questionMargin) return;

	let availableIndecies = await getTotalCarDataAmount();
	let addedQuestions = [];

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
		if (!peer) return null;

		// Find the player object with the matching id
		return peer.getStorage?.players?.find((obj) => obj.id === id) || null;
	} catch (error) {
		console.error("Error occurred in getPlayerInfo function:", error);
		throw error; // Re-throw the error for other unexpected issues
	}
}

export function updatePlayerScore(playerId, newScore) {
	try {
		if (!peer) return null;

		let playerInfo = getPlayerInfo(playerId);
		peer.updateStorageArray("players", "update-matching", { playerInfo }, { ...playerInfo, score: newScore });
	} catch (error) {
		console.error("Error occurred in updatePlayerScore function:", error);
		throw error;
	}
}

export function updatePlayerInGame(playerId, newValue) {
	try {
		if (!peer) return null;

		let playerInfo = getPlayerInfo(playerId);
		peer.updateStorageArray("players", "update-matching", { playerInfo }, { ...playerInfo, inGame: newValue });
	} catch (error) {
		console.error("Error occurred in updatePlayerInGame function:", error);
		throw error;
	}
}

export function getInGamePlayers() {
	return peer.getStorage.players.filter((player) => player.inGame);
}

export function resetMultiplayerScores() {
	if (peer.isHost) {
		const playersArray = peer.getStorage.players;
		let updatedPlayers = [];

		if (Array.isArray(playersArray)) {
			// Create a new array with updated scores
			updatedPlayers = playersArray.map((player) => ({
				...player, // Copy all existing properties
				score: -1, // Reset the score
			}));

			// Update the storage in a single operation
			peer.updateStorage("players", updatedPlayers);
		} else {
			console.error("players.array is not an array or does not exist.");
		}
	}
}

function getPlayerName() {
	if (get(username) !== "Guest") {
		return get(username);
	}

	const adjectives = [
		"Dark",
		"Mystic",
		"Silent",
		"Frozen",
		"Iron",
		"Shadow",
		"Blazing",
		"Thunder",
		"Savage",
		"Ruthless",
		"Swift",
		"Ancient",
		"Lone",
		"Vengeful",
		"Crimson",
		"Phantom",
		"Ghostly",
		"Wandering",
		"Frost",
		"Storm",
		"Doomed",
		"Fallen",
		"Raging",
		"Divine",
		"Infernal",
	];

	const nouns = [
		"Wolf",
		"Knight",
		"Assassin",
		"Mage",
		"Dragon",
		"Reaper",
		"Samurai",
		"Warden",
		"Giant",
		"Viper",
		"Specter",
		"Warlord",
		"Bandit",
		"Outlaw",
		"Hunter",
		"Slayer",
		"Sorcerer",
		"Paladin",
		"Berserker",
		"Titan",
		"Ranger",
		"Nomad",
		"Gladiator",
		"Phoenix",
		"Wraith",
	];

	const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
	return `${randomAdjective}${randomNoun}`; // e.g., "DarkKnight", "FrostDragon"
}
