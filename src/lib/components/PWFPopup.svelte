<script>
	import Popup from "$lib/components/Popup.svelte";
	import Button from "$lib/components/Button.svelte";
	import BasicTable from "./BasicTable.svelte";
	import { PWFPopupBody, PWFCurrentScreen } from "$lib/stores/multiplayerStore";
	import { FastForward, Globe, Unplug, Copy, CopyCheck, Share } from "lucide-svelte";
	import { onMount } from "svelte";
	import { error } from "@sveltejs/kit";
	import { fade, fly } from "svelte/transition";

	let windowWidth = $state();
	let copiedFlag = $state(false);
	let showCopiedMessage = $state(false);
	let timeoutId;

	// Test inputs
	let playerNames = [
		"real name 1",
		"real name 2",
		"real name 3",
		"real name 4",
		"real name 5",
		"a really really really really really really really really long name",
	];
	let code = "abcdef";

	function handleHost() {
		console.log("Host clicked");
		showScreen("host");
	}

	function handleJoin() {
		console.log("Join clicked");
		showScreen("join");
	}

	function showScreen(screen) {
		$PWFCurrentScreen = screen;
	}

	function copyToClipboard(text) {
		navigator.clipboard
			.writeText(text)
			.then(() => console.log("Code copied"))
			.catch((err) => console.error("Failed to copy code", err));
	}

	function handleCopy() {
		copyToClipboard(code);
		copiedFlag = true;
		showCopiedMessage = true;

		clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			showCopiedMessage = false;
		}, 1000);
	}

	function handleHostLeave() {
		showScreen("main");
	}

	onMount(() => {
		showScreen("main");
	});
</script>

<svelte:window bind:innerWidth={windowWidth} />
<Popup
	closeFunction={() => {
		PWFPopupBody.set(false);
	}}
	small={windowWidth > 768}
>
	<div class="pt-6 flex flex-col justify-center items-center">
		{#if $PWFCurrentScreen === "main"}
			<span class="text-3xl font-semibold text-black mb-8">Do you want to...</span>
			<div class="gap-1 md:gap-4 flex flex-col md:flex-row items-center">
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
				<Button buttonHeight="10rem" buttonWidth="10rem" shadowHeight="0.5rem" onclick={handleJoin}>
					<div class="flex flex-col justify-center items-center w-full px-2 gap-4">
						<Unplug strokeWidth={4} absoluteStrokeWidth={true} size={72} />
						<span class="text-white font-semibold text-3xl">Join</span>
					</div>
				</Button>
			</div>
			<p class="text-center text-black mt-8 opacity-50 w-[79%]">
				* Please refrain from using VPNs or proxies as it will more likely than not break multiplayer.
			</p>
		{:else if $PWFCurrentScreen === "host"}
			<div class="flex flex-col justify-center items-center w-full">
				<span>Code:</span>
				<div class="flex align-middle mb-5 items-center gap-4">
					<span class="text-3xl font-semibold text-black">
						{#each code as letter}
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
							<Copy strokeWidth={3} absoluteStrokeWidth={true} color={"var(--black)"} />
						{:else}
							<CopyCheck strokeWidth={3} absoluteStrokeWidth={true} color={"var(--white)"} />
						{/if}
						{#if showCopiedMessage}
							<span
								in:fly={{ y: 10, delay: 50 }}
								out:fade={{ duration: 150 }}
								class="absolute -top-7 -left-12 text-black"
							>
								Copied!
							</span>
						{/if}
					</button>
				</div>
				<div class="w-[80%] pb-2">
					<BasicTable array={playerNames} emptyMessage={"Waiting for players..."} />
					<span>
						{playerNames.length} player{playerNames.length > 1 || playerNames.length == 0 ? "s are" : " is"} waiting!
					</span>
				</div>
				<div class="flex gap-5 w-[80%]">
					<div class="w-2/3">
						<Button
							color="var(--green-button)"
							bgcolor="var(--green-button-dark)"
							customClasses="!w-full"
							buttonHeight="4rem"
							buttonWidth="21rem"
							shadowHeight="0.5rem"
							onclick={() => {
								console.log("Start clicked!");
							}}
						>
							<span class="text-white w-full text-center font-semibold text-3xl">Start</span>
						</Button>
					</div>
					<div class="w-1/3">
						<Button
							customClasses="!w-full"
							buttonHeight="4rem"
							buttonWidth="21rem"
							shadowHeight="0.5rem"
							onclick={handleHostLeave}
						>
							{#if windowWidth >= 768}
								<span class="text-white w-full text-center font-semibold text-3xl">Leave</span>
							{:else}
								<div class="-rotate-90">
									<Share strokeWidth={3} size={28} />
								</div>
							{/if}
						</Button>
					</div>
				</div>
			</div>
		{:else if $PWFCurrentScreen === "join"}
			<div class="pt-6 flex flex-col justify-center items-center">
				<span class="text-3xl font-semibold text-black mb-5">Join screen</span>
			</div>
		{/if}
	</div>
</Popup>

<style>
	.copied {
		background-color: var(--default-button);
	}
</style>
