<script>
	import Popup from "$lib/components/Popup.svelte";
	import Button from "$lib/components/Button.svelte";
	import MultiplayerPlayerTable from "./MultiplayerPlayerTable.svelte";
	import {
		multiplayerCurrentScreen,
		currentPlayers,
		roomId,
		multiplayerFlag,
		peer,
		multiplayerStatus,
	} from "$lib/stores/multiplayerStore";
	import { multiplayerPopup } from "$lib/stores/uiStore";
	import {
		FastForward,
		Globe,
		Unplug,
		Copy,
		CopyCheck,
		ClipboardPaste,
		Users,
		SeparatorVertical,
		ArrowLeft,
	} from "lucide-svelte";
	import { host, handleJoinRoom, leaveMultiplayerRoom } from "$lib/utils/multiplayer";
	import { onMount } from "svelte";
	import { error } from "@sveltejs/kit";
	import { fade, fly } from "svelte/transition";
	import { get } from "svelte/store";
	import { goto } from "$app/navigation";

	let windowWidth = $state();
	let copiedFlag = $state(false);
	let showCopiedMessage = $state(false);
	let timeoutId;

	let alphanetPlaceholders = ["A", "B", "C", "D", "E", "F"];
	let codeInputs = $state(Array(6).fill(""));
	let isCodeInput = $state(false);
	let inputRefs = $state([]);

	let peerStatus = $state();
	let connectedToRoomFlag = $derived.by(() => {
		if ($multiplayerStatus == "Connection to host established.") return true;
		return false;
	});

	// Test inputs
	let playerNames = [
		"real name 1",
		"real name 2",
		"real name 3",
		"real name 4",
		"real name 5",
		"a really really really really really really really really long name",
	];

	async function handlePlayerEnter() {
		let codeString = codeInputs.join("");
		await handleJoinRoom(codeString.toLocaleLowerCase());
	}

	function handleLeave() {
		leaveMultiplayerRoom();
		$multiplayerCurrentScreen = "main";
	}

	async function handleCreateRoom() {
		// creates a room if none exist
		if (!$roomId) {
			console.log("Room doesn't exist, creating one...");
			const code = await host();
			$roomId = code.replaceAll("autoguessr_", "");
			return;
		}
	}

	async function handleHost() {
		$multiplayerCurrentScreen = "host";
		await handleCreateRoom();
	}

	// Copy code ---------------------------------------------------------------------------------------
	function copyToClipboard(text) {
		navigator.clipboard.writeText(text.toUpperCase()).catch((err) => console.error("Failed to copy code", err));
	}

	function handleCopy() {
		copyToClipboard($roomId);
		copiedFlag = true;
		showCopiedMessage = true;

		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			showCopiedMessage = false;
			copiedFlag = false;
		}, 1000);
	}

	// Paste code ---------------------------------------------------------------------------------------
	function fillCode(premadeCode) {
		codeInputs = premadeCode.split("").slice(0, 6);
	}

	function handlePaste() {
		navigator.clipboard
			.readText()
			.then((text) => {
				fillCode(text.toUpperCase());
			})
			.catch((err) => {
				console.error("Failed to read clipboard contents: ", err);
			});
	}

	// Handle Inputs ---------------------------------------------------------------------------------------

	// Svelte action to collect element references
	function collectRef(node, index) {
		inputRefs[index] = node;
		return {
			destroy() {
				inputRefs[index] = null;
			},
		};
	}

	// Handles input: validates a single uppercase letter and moves focus
	function handleInput(e, index) {
		let val = e.target.value.toUpperCase().slice(0, 1);
		if (/^[A-Z]$/.test(val)) {
			codeInputs[index] = val;
			e.target.value = val;

			codeInputs = [...codeInputs];

			// Move focus to the next input if available
			if (index < alphanetPlaceholders.length - 1) {
				inputRefs[index + 1]?.focus();
			}
		} else {
			// Clear invalid input
			codeInputs[index] = "";
			e.target.value = "";
			codeInputs = [...codeInputs];
		}
	}

	// Handle keydown event for Backspace: move focus to previous if needed
	function handleKeyDown(e, index) {
		if (e.key === "Backspace" && !codeInputs[index] && index > 0) {
			inputRefs[index - 1]?.focus();
		}
	}

	multiplayerPopup.subscribe((value) => {
		if (value) $multiplayerCurrentScreen = "main";
	});

	$effect(() => {
		const index = codeInputs.findIndex((e) => {
			return e == "" || e == undefined;
		});
		isCodeInput = index == -1;
	});
</script>

<svelte:window bind:innerWidth={windowWidth} />
{#if $multiplayerPopup}
	<Popup
		closeFunction={() => {
			multiplayerPopup.set(false);
			leaveMultiplayerRoom();
		}}
		small={windowWidth > 768}
	>
		<div class="pt-6 flex flex-col justify-center items-center">
			{#if $multiplayerCurrentScreen === "main"}
				<span class="text-3xl font-semibold text-black mb-8">Do you want to...</span>
				<div class="gap-1 md:gap-4 flex flex-col md:flex-row items-center main-screen">
					<Button
						color="var(--green-button)"
						bgcolor="var(--green-button-dark)"
						buttonHeight="10rem"
						buttonWidth="10rem"
						shadowHeight="0.5rem"
						onclick={handleHost}
					>
						<div class="flex flex-col justify-center items-center w-full px-2 gap-4">
							<Globe strokeWidth={4} absoluteStrokeWidth={true} size={72} />
							<span class="text-white font-semibold text-3xl">Host</span>
						</div>
					</Button>
					<span class="text-2xl text-black opacity-80">or</span>
					<Button
						buttonHeight="10rem"
						buttonWidth="10rem"
						shadowHeight="0.5rem"
						onclick={() => {
							copiedFlag = false;
							codeInputs = Array(6).fill("");
							$multiplayerCurrentScreen = "join";
						}}
					>
						<div class="flex flex-col justify-center items-center w-full px-2 gap-4">
							<Unplug strokeWidth={4} absoluteStrokeWidth={true} size={72} />
							<span class="text-white font-semibold text-3xl">Join</span>
						</div>
					</Button>
				</div>
				<p class="text-center text-black mt-8 opacity-50 w-[79%]">
					* Please refrain from using VPNs or proxies as it will more likely than not break multiplayer.
				</p>
			{:else if $multiplayerCurrentScreen === "host"}
				<div class="flex flex-col justify-center items-center w-full">
					<span class="text-black">Code:</span>
					<div class="flex align-middle mb-5 items-center gap-4">
						<span class="text-3xl font-semibold text-black">
							{#each $roomId as letter}
								<span class="underline mx-1">
									{letter.toUpperCase()}
								</span>
							{/each}
						</span>
						<button
							class="relative p-2 rounded-lg bg-tanDark cursor-pointer transition ease-in-out delay-50"
							class:copied={copiedFlag}
							onclick={handleCopy}
						>
							{#if !copiedFlag}
								<Copy strokeWidth={2.5} absoluteStrokeWidth={true} color={"var(--black)"} />
							{:else}
								<CopyCheck strokeWidth={2.5} absoluteStrokeWidth={true} color={"var(--white)"} />
							{/if}
							{#if showCopiedMessage}
								<span
									in:fly={{ y: 10, delay: 50 }}
									out:fade={{ duration: 150 }}
									class="absolute -top-7 left-1/2 transform -translate-x-1/2 text-black"
								>
									Copied!
								</span>
							{/if}
						</button>
					</div>
					<div class="w-[80%]">
						<MultiplayerPlayerTable array={$currentPlayers} emptyMessage={"Waiting for players..."} />
						<div class="flex items-center gap-1 mt-1 text-black">
							<Users strokeWidth={1.5} size={16} absoluteStrokeWidth={true} color={"var(--black)"} />
							{$currentPlayers?.length}
						</div>
					</div>
					<div class="flex gap-5 w-[80%] mt-3">
						<div class="w-1/4">
							<Button
								customClasses="!w-full"
								buttonHeight="4rem"
								buttonWidth="21rem"
								shadowHeight="0.5rem"
								onclick={handleLeave}
							>
								<ArrowLeft strokeWidth={4} size={28} />
							</Button>
						</div>
						<div class="w-3/4">
							<Button
								color="var(--green-button)"
								bgcolor="var(--green-button-dark)"
								customClasses="!w-full"
								buttonHeight="4rem"
								buttonWidth="21rem"
								shadowHeight="0.5rem"
								disabled={$currentPlayers?.length <= 1}
								onclick={() => {
									$peer?.updateStorage("matchIndex", $peer?.getStorage?.matchIndex + 1);
								}}
							>
								<span class="text-white w-full text-center font-semibold text-3xl">Start</span>
							</Button>
						</div>
					</div>
				</div>
			{:else if $multiplayerCurrentScreen === "join"}
				<div class="flex flex-col justify-center items-center w-full">
					{#if !connectedToRoomFlag}
						<span class="mb-2">Enter the room code:</span>
						<div class="flex align-middle mb-5 items-center gap-4">
							<div class="flex w-full h-10 gap-2">
								{#each alphanetPlaceholders as letter, index (index)}
									<div>
										<input
											type="text"
											placeholder={letter}
											class="bg-tanDark rounded-lg h-full w-10 text-center outline-none text-black text-lg font-bold"
											oninput={(e) => handleInput(e, index)}
											onkeydown={(e) => handleKeyDown(e, index)}
											bind:value={codeInputs[index]}
											use:collectRef={index}
										/>
										<div class="code-underline" style:opacity={codeInputs[index] ? 1 : 0.2}></div>
									</div>
								{/each}
							</div>
							<button
								class="relative p-2 rounded-lg bg-tanDark cursor-pointer transition ease-in-out delay-50"
								class:copied={copiedFlag}
								onclick={handlePaste}
							>
								<ClipboardPaste strokeWidth={2.5} absoluteStrokeWidth={true} color={"var(--black)"} />
							</button>
						</div>
						<p>
							{$multiplayerStatus == "Destroyed." ? "" : $multiplayerStatus}
						</p>
					{:else}
						<div class="w-full flex flex-col justify-center items-center">
							<p class="text-base mb-4">Waiting for host to start...</p>
							<p class="w-[80%]">
								<MultiplayerPlayerTable array={$currentPlayers} emptyMessage={multiplayerStatus} />
							</p>
						</div>
					{/if}
					<div class="flex gap-5 w-[80%] mt-4">
						<div class="w-1/4">
							<Button
								customClasses="!w-full"
								buttonHeight="4rem"
								buttonWidth="21rem"
								shadowHeight="0.5rem"
								onclick={handleLeave}
							>
								<ArrowLeft strokeWidth={4} size={28} absoluteStrokeWidth={true} />
							</Button>
						</div>
						{#if !connectedToRoomFlag}
							<div class="w-3/4">
								<Button
									color="var(--green-button)"
									bgcolor="var(--green-button-dark)"
									customClasses="!w-full"
									buttonHeight="4rem"
									buttonWidth="21rem"
									shadowHeight="0.5rem"
									disabled={!isCodeInput}
									onclick={handlePlayerEnter}
								>
									<span class="text-white w-full text-center font-semibold text-3xl">Enter</span>
								</Button>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</Popup>
{/if}

<style>
	.copied {
		background-color: var(--default-button);
	}

	.code-underline {
		height: 2px;
		width: 100%;
		background-color: black;
		margin-top: 4px;
		transition: opacity 250ms;
	}

	input::placeholder {
		color: var(--black);
		opacity: 0.15;
	}

	@media (max-height: 640px) {
		.main-screen {
			flex-direction: row !important;
			gap: 0.5rem !important;
		}

		.main-screen > span {
			display: none;
		}
	}
</style>
