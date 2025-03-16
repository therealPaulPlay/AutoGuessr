import PlayPeer from "playpeerjs";
import { CurrentPlayers } from "$lib/stores/multiplayerStore";
import { get } from "svelte/store";

let peer;
let peerId = `autoguessr_${generateRoomCode()}`;

export function handleHostStart() {
	console.log("Room code:", getRoomCodeFromPeerId(peerId));

	host();
	return peerId; // host id
}

export async function handleJoinRoom(roomId) {
	if (!roomId) return alert("Please enter the Room code (Host ID)");

	try {
		if (!peer) await initPeer(peerId);
		await peer.joinRoom(`autoguessr_${roomId.toLowerCase()}`);
	} catch (error) {
		alert("Failed to join: " + error.message);
	}
}

export function getRoomCodeFromPeerId(peerId) {
	const parts = peerId.split("_");
	if (parts.length > 1) {
		return parts[1];
	}
	return "";
}

function generateRoomCode() {
	let randomString = "";
	for (let i = 0; i < 6; i++) {
		const randomCharCode = Math.floor(Math.random() * 26) + 97;
		randomString += String.fromCharCode(randomCharCode);
	}
	return randomString;
}

async function initPeer(id) {
	peer = new PlayPeer(id, {
		config: {
			iceServers: [
				{ urls: "stun:stun.l.google.com:19302" },
				{ urls: "turn:freestun.net:3478", username: "free", credential: "free" }, // For production, use fastturn, or a different turn server
			],
		},
	});

	peer.onEvent("status", (status) => {
		console.log("Status:", status);
	});
	peer.onEvent("storageUpdated", (storage) => {
        CurrentPlayers.set(storage.players);
	});

	peer.onEvent("incomingPeerConnected", (newPeerId) => {
		peer.updateStorageArray("players", "add-unique", { id: newPeerId });
	});
    peer.onEvent("incomingPeerDisconnected", (disconnectedPeerId) => {
		peer.updateStorageArray("players", "remove-matching", { id: disconnectedPeerId });
	});

	await peer.init();
}

async function host() {
	if (!peer) await initPeer(peerId);
	await peer.createRoom({ players: [] });
}
