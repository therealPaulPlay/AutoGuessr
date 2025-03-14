<script>
	import Popup from "$lib/components/Popup.svelte";
	import Button from "$lib/components/Button.svelte";
	import { PWFPopupBody, PWFCurrentScreen } from "$lib/stores/multiplayerStore";
	import { FastForward, Globe, Unplug } from "lucide-svelte";
	import { onMount } from "svelte";
	import { error } from "@sveltejs/kit";

	let windowWidth = $state();

	function handleHost() {
		console.log("Host clicked");
		showScreen("host");
	}

	function handleJoin() {
		console.log("Join clicked");
		showScreen("join")
	}

	function showScreen(screen) {
		$PWFCurrentScreen = screen;
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
		{#if $PWFCurrentScreen === 'main'}
			<span class="text-3xl font-semibold text-black mb-8">Do you want to...</span>
			<div class="gap-4 flex flex-col md:flex-row items-center">
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
		{:else if $PWFCurrentScreen === 'host'}
			<div class="pt-6 flex flex-col justify-center items-center">
				<span class="text-3xl font-semibold text-black mb-5">Host screen</span>
			</div>
		{:else if $PWFCurrentScreen === 'join'}
			<div class="pt-6 flex flex-col justify-center items-center">
				<span class="text-3xl font-semibold text-black mb-5">Join screen</span>
			</div>
		{/if}
	</div>
</Popup>
