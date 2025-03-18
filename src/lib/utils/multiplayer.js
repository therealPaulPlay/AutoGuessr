import PlayPeer from "playpeerjs";
import { currentPlayers, multiplayerFlag, roomId, peerStore, peerStatusStore, gameInProgressFlag } from "$lib/stores/multiplayerStore";
import { get } from "svelte/store";

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
		console.log(storage)
		if(get(gameInProgressFlag) != storage.gameInProgress) {
			gameInProgressFlag.set(storage.gameInProgress);
			console.log("gameInProgressFlag updated to", get(gameInProgressFlag));
		}
	});

	// For host: When a peer is connected to the host
	peer.onEvent("incomingPeerConnected", (newPeerId) => {
		peer.updateStorageArray("players", "add-unique", { id: newPeerId, score: -1 });
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
	await peer.createRoom({ players: [], gameInProgress: false, questionsIds: ["10", "20", "30", "40", "50"] });
	if(peer.isHost) peer.updateStorageArray("players", "add-unique", { id: peer.id, score: -1 });
}
