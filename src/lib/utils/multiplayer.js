import PlayPeer from "playpeerjs";
import { CurrentPlayers, MultiplayerFlag, roomId, peerStore, peerStatusStore } from "$lib/stores/multiplayerStore";
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
		MultiplayerFlag.set(true);
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
	if(!peer) return;
	peer.destroy();
	peer = null;
	roomId.set("");
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
		peerStatusStore.set(status)
	});
	peer.onEvent("storageUpdated", (storage) => {
        CurrentPlayers.set(storage.players);
	});

	// For host: When a peer is connected to the host
	peer.onEvent("incomingPeerConnected", (newPeerId) => {
		peer.updateStorageArray("players", "add-unique", { id: newPeerId });
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
	await peer.createRoom({ players: [] });
}
