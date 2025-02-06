<script>
	import "../app.css";
	import Button from "$lib/components/Button.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import { page } from "$app/stores";
	import { isAuthenticated, username } from "$lib/stores/accountStore";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { settingsPopup, signupPopup, accountPopup, leavePopup } from "$lib/stores/uiStore";
	import { displayError } from "$lib/utils/displayError";
	import { checkAuthenticationStatus } from "$lib/utils/checkAuthStatus";
	import { User, TriangleAlert, Scan, UserPlus } from "lucide-svelte";
	import { onMount } from "svelte";
	import SignupPopup from "$lib/components/signupPopup.svelte";
	import AccountPopup from "$lib/components/AccountPopup.svelte";
	import PriceSlider from "$lib/components/PriceSlider.svelte";
	import Toggle from "$lib/components/Toggle.svelte";
	import SettingsPopup from "$lib/components/SettingsPopup.svelte";
	import LeavePopup from "$lib/components/LeavePopup.svelte";
	import { scale } from "svelte/transition";
	import Analytics from "$lib/components/Analytics.svelte";
	import HowToPlayPopup from "$lib/components/HowToPlayPopup.svelte";
	import ErrorPopup from "$lib/components/ErrorPopup.svelte";
	import ResultPopup from "$lib/components/ResultPopup.svelte";
	import { Howl, Howler } from "howler";
	import { gameVolume, music } from "$lib/stores/gameStore";
	import CreditsPopup from "$lib/components/CreditsPopup.svelte";

	let { children } = $props();

	function HandleBackButton() {
		const leavePopupUrls = ["/game"]; // URLs to have confirmation before leaving
		new Howl({ src: ["/sounds/short_click.webm"] }).play();
		if (leavePopupUrls.includes($page.url.pathname)) {
			$leavePopup = true;
		} else {
			goto("/");
		}
	}

	// Authenticate
	onMount(() => {
		checkAuthenticationStatus();
	});

	// Sounds and Music
	onMount(() => {
		gameVolume.set(parseInt(localStorage.getItem("autoguessr_volume") || "75", 10));
		Howler.volume($gameVolume / 100); // Apply the volume globally to Howler
		const storedValue = localStorage.getItem("autoguessr_music");
		music.set(!Boolean(storedValue));
		const backgroundMusic = new Howl({
			src: ["/music/west_coast_music.mp3"], // Path to your music file
			loop: true, // Enable looping
			volume: 0.15, // Default volume
		});

		$effect(() => {
			$music ? backgroundMusic.play() : backgroundMusic.pause();
			if (!$music) localStorage.setItem("autoguessr_music", "off");
			if ($music) localStorage.removeItem("autoguessr_music");
		});
	});
</script>

<nav
	class="fixed left-0 right-0 flex flex-row justify-between p-4 items-center z-20 transition {$page.url.pathname !== '/'
		? 'max-sm:bg-white'
		: ''}"
>
	<div>
		{#if $page.url.pathname != "/"}
			<button class="w-10 h-10 transition active:scale-90" onclick={HandleBackButton}>
				<img src="{base}/assets/svg/point_arrow.svg" alt="Back" />
			</button>
		{:else}
			<img src="/android-chrome-512x512.png" class="w-10 h-10 md:hidden" alt="logo mobile" />
		{/if}
	</div>
	<!-- Right side -->
	<div class="flex flex-row relative">
		<!-- Username/level -->
		<div class="mx-3 flex items-center rounded-lg transition {$isAuthenticated ? 'bg-white' : ''}">
			{#if $isAuthenticated}
				<div class="p-3 flex items-center" in:scale>
					<button
						class="flex items-center justify-center mr-4 transition hover:opacity-75
                ml-2"
						onclick={() => {
							accountPopup.set(true);
						}}
					>
						<span class="text-xl z-10 text-white font-semibold"><User strokeWidth={2} /></span>
						<image class="absolute w-9 h-9" src="/assets/svg/level.svg" alt="level"></image>
					</button>
					<div class="text-xl font-semibold">{$username}</div>
				</div>
			{:else}
				<Button
					buttonWidth="3.25rem"
					onclick={() => {
						signupPopup.set(true);
					}}><span class="text-white text-xl font-medium"><UserPlus strokeWidth={2.5} /></span></Button
				>
			{/if}
		</div>
		<div class="flex flex-row items-center">
			<Button
				color="var(--default-button)"
				bgcolor="var(--default-button-dark)"
				buttonHeight="3.25rem"
				buttonWidth="3.25rem"
				onclick={() => settingsPopup.set(true)}
			>
				<img src="/assets/svg/settings.svg" alt="settings" style:width="1.5rem" />
			</Button>
		</div>
	</div>
</nav>

<main class="pt-[calc(4rem+7dvh)] fixed top-0 bottom-0 right-0 left-0 bg-tanLight overflow-auto">
	{@render children?.()}
</main>

<!-- Universal Popups -->
<SettingsPopup />
<LeavePopup />
<HowToPlayPopup />
<ErrorPopup />
<SignupPopup />
<AccountPopup />
<Analytics />
<ResultPopup />
<CreditsPopup />
