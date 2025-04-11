import PlayPeer from "playpeerjs";
import {
	currentPlayers,
	multiplayerFlag,
	roomId,
	peer,
	multiplayerStatus,
	inGame,
	playersInGame,
	multiplayerQuestionsList,
	currentMatchIndex,
} from "$lib/stores/multiplayerStore";
import { get } from "svelte/store";
import { difficulty, totalCarAmount } from "$lib/stores/gameStore";
import { getTotalCarDataAmount } from "./gameFunctions";
import { username } from "$lib/stores/accountStore";
import { displayError } from "./displayError";
import { goto } from "$app/navigation";
import { multiplayerPopup } from "$lib/stores/uiStore";

export async function handleJoinRoom(roomId) {
	try {
		if (!get(peer)) await initPeer();
		await get(peer)?.joinRoom(`autoguessr_${roomId.toLowerCase()}`);
		multiplayerFlag.set(true);
	} catch (error) {
		console.error("Failed to join:", error);
	}
}

export function leaveMultiplayerRoom(dontDestroy = false) {
	if (!get(peer)) return;
	multiplayerFlag.set(false); // First thing: set multiplayer to false to prevent displayed errors!
	if (!dontDestroy) get(peer).destroy();
	peer.set(null);
	roomId.set("");
	currentMatchIndex.set(0);
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
	const peerId = `autoguessr_${generateRoomCode()}`;
	peer.set(
		new PlayPeer(peerId, {
			config: {
				iceServers: [
					{ urls: "stun:stun.l.google.com:19302" },
					{ urls: "turn:freestun.net:3478", username: "free", credential: "free" }, // For production, use fastturn, or a different turn server
				],
			},
		}),
	);

	get(peer).onEvent("status", (status) => {
		multiplayerStatus.set(status);
	});

	get(peer).onEvent("error", (error) => {
		if (!get(multiplayerFlag)) return;
		console.error("PlayPeerJS error: " + error);
		displayError("PlayPeerJS error: " + error);
	});

	get(peer).onEvent("instanceDestroyed", () => {
		if (!get(multiplayerFlag)) return;
		leaveMultiplayerRoom(true);
	});

	get(peer).onEvent("storageUpdated", async (storage) => {
		currentPlayers.set(storage?.players);

		if (!getPlayerInfo(get(peer)?.id)) {
			const name = getPlayerName();
			get(peer).updateStorageArray("players", "add-unique", {
				id: get(peer)?.id,
				score: 0,
				round: 0,
				inGame: false,
				name,
			});
		}

		if (JSON.stringify(get(playersInGame)) !== JSON.stringify(getInGamePlayers())) {
			playersInGame.set(getInGamePlayers());
		}

		if (get(currentMatchIndex) != storage?.matchIndex && storage?.questionsIds?.length !== 0) {
			currentMatchIndex.set(storage?.matchIndex);
			multiplayerPopup.set(false);
			(get(playersInGame)?.length > 0) ? goto("/game") : goto("/game/end");
		}

		const playerInfo = getPlayerInfo(get(peer)?.id);
		if (playerInfo && get(inGame) !== playerInfo?.inGame) {
			inGame.set(playerInfo?.inGame);
		}

		const questionMargin = 3;
		if (maxRound(storage?.players) > storage?.questionsIds?.length - questionMargin && get(peer)?.isHost) {
			await checkQuestionsArray(storage?.players, storage?.questionsIds);
		}

		if (JSON.stringify(get(multiplayerQuestionsList)) !== JSON.stringify(storage?.questionsIds)) {
			multiplayerQuestionsList.set(storage?.questionsIds);
		}
	});

	get(peer).onEvent("incomingPeerDisconnected", (disconnectedPeerId) => {
		const currentPlayerInfo = getPlayerInfo(disconnectedPeerId);
		get(peer).updateStorageArray("players", "remove-matching", currentPlayerInfo);
	});

	// For peer: When peer connects/discconects from host
	get(peer).onEvent("outgoingPeerDisconnected", (disconnectedPeerId) => {
		const currentPlayerInfo = getPlayerInfo(disconnectedPeerId);
		get(peer)?.updateStorageArray("players", "remove-matching", currentPlayerInfo);
	});

	await get(peer).init();
}

export async function host() {
	try {
		if (!get(peer)) await initPeer();

		const name = getPlayerName();
		const diff = get(difficulty);
		const code = await get(peer)?.createRoom({
			matchIndex: 0,
			players: [{ id: get(peer)?.id, score: 0, round: 0, inGame: false, name }],
			difficulty: diff,
			questionsIds: [],
		});
		multiplayerFlag.set(true);
		return code;
	} catch (error) {
		console.error("Error occurred in host function:", error);
		displayError("Failed to create room: " + error);
	}
}

async function checkQuestionsArray(playersArray, questionsArray) {
	let availableIndecies = await getTotalCarDataAmount();
	let addedQuestions = [];

	const newQuestion = Math.floor(Math.random() * availableIndecies);
	get(peer)?.updateStorageArray("questionsIds", "add", newQuestion);
}

function maxScore(array) {
	let maxScore = 0;
	for (const item of array) {
		if (item.score > maxScore) maxScore = item.score;
	}
	return maxScore;
}

function maxRound(array) {
	let maxRound = 0;
	for (const item of array) {
		if (item.round > maxRound) maxRound = item.score;
	}
	return maxRound;
}

export function getPlayerInfo(id) {
	try {
		return get(peer)?.getStorage?.players?.find((obj) => obj.id === id) || null; // Find the player object with the matching id
	} catch (error) {
		console.error("Error occurred in getPlayerInfo function:", error);
		throw error; // Re-throw the error for other unexpected issues
	}
}

export function updatePlayerScore(playerId, newScore) {
	let playerInfo = getPlayerInfo(playerId);
	get(peer)?.updateStorageArray("players", "update-matching", playerInfo, { ...playerInfo, score: newScore });
}

export function updatePlayerRound(playerId, newRound) {
	let playerInfo = getPlayerInfo(playerId);
	get(peer)?.updateStorageArray("players", "update-matching", playerInfo, { ...playerInfo, round: newRound });
}

export function updatePlayerInGame(playerId, newValue) {
	let playerInfo = getPlayerInfo(playerId);
	get(peer)?.updateStorageArray("players", "update-matching", playerInfo, { ...playerInfo, inGame: newValue });
}

export function getInGamePlayers() {
	return get(peer)?.getStorage?.players?.filter((player) => player.inGame);
}

export function resetMultiplayerScores() {
	if (get(peer)?.isHost) {
		const playersArray = get(peer)?.getStorage.players;
		let updatedPlayers = [];

		if (Array.isArray(playersArray)) {
			// Create a new array with updated scores
			updatedPlayers = playersArray.map((player) => ({
				...player, // Copy all existing properties
				score: 0,
				round: 0,
			}));

			// Update the storage in a single operation
			get(peer)?.updateStorage("players", updatedPlayers);
		} else {
			console.error("players.array is not an array or does not exist.");
		}
	}
}

export function getPlayerWithHighestScore() {
	try {
		const players = get(peer)?.getStorage?.players;
		if (!Array.isArray(players) || !players?.length) {
			console.error("Players is not an array or no players found");
			return null;
		}

		// Find player with highest score
		let highestScoringPlayer = players[0];
		for (const player of players) {
			if (player.score > highestScoringPlayer.score) highestScoringPlayer = player;
		}

		return highestScoringPlayer;
	} catch (error) {
		console.error("Error in getPlayerWithHighestScore:", error);
		throw error;
	}
}

function getPlayerName() {
	if (get(username) !== "Guest" && get(username)) return get(username);

	const adjectives = [
		"Mystic",
		"Silent",
		"Frozen",
		"Iron",
		"Shadow",
		"Blazing",
		"Thunder",
		"Savage",
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
		"Samurai",
		"Warden",
		"Titan",
		"Ranger",
		"Nomad",
		"Phoenix",
		"Wraith",
	];

	const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
	const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
	return `${randomAdjective}${randomNoun}`; // e.g., "DarkKnight", "FrostDragon"
}
