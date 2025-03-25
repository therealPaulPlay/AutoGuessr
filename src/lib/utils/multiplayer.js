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
		await get(peer).joinRoom(`autoguessr_${roomId.toLowerCase()}`);
		multiplayerFlag.set(true);
	} catch (error) {
		displayError("Failed to join: " + error.message)
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
	peer.set(new PlayPeer(peerId, {
		config: {
			iceServers: [
				{ urls: "stun:stun.l.google.com:19302" },
				{ urls: "turn:freestun.net:3478", username: "free", credential: "free" }, // For production, use fastturn, or a different turn server
			],
		},
	}));

	get(peer).onEvent("status", (status) => {
		multiplayerStatus.set(status);
	});

	get(peer).onEvent("error", (error) => {
		if (!get(multiplayerFlag)) return;
		console.error("PlayPeerJS error: " + error);
		displayError("PlayPeerJS error: " + error);
	});

	get(peer).onEvent("destroy", () => {
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
				inGame: false,
				name,
			});
		}

		if (get(currentMatchIndex) != storage?.matchIndex && storage?.questionsIds?.length !== 0) {
			currentMatchIndex.set(storage?.matchIndex);
			multiplayerPopup.set(false);
			goto("/game");
		}

		const playerInfo = getPlayerInfo(get(peer).id);
		if (playerInfo && get(inGame) !== playerInfo?.inGame) {
			inGame.set(playerInfo?.inGame);
		}

		const currentInGame = get(playersInGame);
		if (JSON.stringify(currentInGame) !== JSON.stringify(getInGamePlayers())) {
			playersInGame.set(getInGamePlayers());
		}

		if (maxScore(storage?.players) >= storage?.questionsIds?.length - 3 && get(peer)?.isHost) {
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
		get(peer).updateStorageArray("players", "remove-matching", currentPlayerInfo);
	});

	await get(peer).init();
}

export async function host() {
	try {
		if (!get(peer)) await initPeer();

		const name = getPlayerName();
		const diff = get(difficulty);
		const code = await get(peer).createRoom({
			matchIndex: 0,
			players: [
				{ id: get(peer).id, score: 0, inGame: false, name }
			], gameInProgress: false, gameRestarted: false, difficulty: diff, questionsIds: []
		});
		multiplayerFlag.set(true);
		return code;
	} catch (error) {
		console.error("Error occurred in host function:", error);
		displayError("Failed to create room: " + error);
	}
}

async function checkQuestionsArray(playersArray, questionsArray) {
	// Insure the function runs only for host, that way we don't have this function run multiple times for each peer
	if (!get(peer).isHost) return;

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
	get(peer).updateStorage("questionsIds", newQuestionArray);
}

function maxScore(array) {
	let maxScore = 0;
	for (const item of array) {
		if (item.score > maxScore) {
			maxScore = item.score;
		}
	}
	return maxScore;
}

export function getPlayerInfo(id) {
	try {
		if (!get(peer)) return null;

		// Find the player object with the matching id
		return get(peer).getStorage?.players?.find((obj) => obj.id === id) || null;
	} catch (error) {
		console.error("Error occurred in getPlayerInfo function:", error);
		throw error; // Re-throw the error for other unexpected issues
	}
}

export function updatePlayerScore(playerId, newScore) {
	try {
		let playerInfo = getPlayerInfo(playerId);
		get(peer)?.updateStorageArray("players", "update-matching", playerInfo, { ...playerInfo, score: newScore });
	} catch (error) {
		console.error("Error occurred in updatePlayerScore function:", error);
	}
}

export function updatePlayerInGame(playerId, newValue) {
	try {
		let playerInfo = getPlayerInfo(playerId);
		get(peer)?.updateStorageArray("players", "update-matching", playerInfo, { ...playerInfo, inGame: newValue });
	} catch (error) {
		console.error("Error occurred in updatePlayerInGame function:", error);
	}
}

export function getInGamePlayers() {
	return get(peer).getStorage.players.filter((player) => player.inGame);
}

export function resetMultiplayerScores() {
	if (get(peer).isHost) {
		const playersArray = get(peer).getStorage.players;
		let updatedPlayers = [];

		if (Array.isArray(playersArray)) {
			// Create a new array with updated scores
			updatedPlayers = playersArray.map((player) => ({
				...player, // Copy all existing properties
				score: 0, // Reset the score
			}));

			// Update the storage in a single operation
			get(peer).updateStorage("players", updatedPlayers);
		} else {
			console.error("players.array is not an array or does not exist.");
		}
	}
}

function getPlayerName() {
	if (get(username) !== "Guest" && get(username)) {
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
