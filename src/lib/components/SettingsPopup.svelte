<script>
	import { creditsPopup, settingsPopup } from "$lib/stores/uiStore";
	import Popup from "./Popup.svelte";
	import Toggle from "./Toggle.svelte";
	import Button from "./Button.svelte";
	import { ExternalLink, Scan } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { gameVolume } from "$lib/stores/gameStore";
	import { Howler } from "howler"; // Import Howler
	import { music } from "$lib/stores/gameStore";

	// Update volume in both Howler and localStorage
	function updateVolume(event) {
		$gameVolume = event.target.value;
		Howler.volume($gameVolume / 100);
		localStorage.setItem("autoguessr_volume", $gameVolume);
	}
</script>

{#if $settingsPopup}
	<Popup
		title="Settings"
		closeFunction={() => {
			settingsPopup.set(false);
		}}
	>
		<div class="overflow-y-auto max-h-[50dvh]">
			<div class="h-4/6 w-full p-4 flex flex-col gap-5 max-h-4/6">
				<!-- Volume Slider -->
				<div class="flex items-center gap-10 justify-between">
					<label for="volume-slider" class="text-base font-semibold">Volume</label>
					<div class="w-1/2">
						<input
							type="range"
							id="volume-slider"
							min="0"
							max="100"
							bind:value={$gameVolume}
							oninput={updateVolume}
							class="slider"
						/>
					</div>
				</div>

				<!-- Music Toggle -->
				<div class="flex items-center gap-10 justify-between">
					<label for="music" class="text-base font-semibold">Music</label>
					<div class="w-1/2 flex h-fit items-center">
						<Toggle bind:checked={$music} />
					</div>
				</div>

				<!-- Fullscreen Toggle -->
				<div class="flex items-center gap-10 justify-between">
					<label for="fullscreen" class="text-base font-semibold">Fullscreen</label>
					<div class="w-1/2 flex">
						<Button
							color="var(--default-button)"
							bgcolor="var(--default-button-dark)"
							onclick={() => {
								// Toggle on/off fullscreen
								if (document.fullscreenElement) {
									document.exitFullscreen();
								} else {
									document.documentElement.requestFullscreen();
								}
							}}
						>
							Toggle
							<Scan strokeWidth={3} class="ml-3" color="var(--white)" />
						</Button>
					</div>
				</div>
				<!-- Legal Information -->
				<div class="flex items-center gap-10 justify-between">
					<label for="legal-info" class="text-base font-semibold">Legal information</label>
					<div class="w-1/2 flex">
						<Button
							onclick={() => {
								goto("/legal");
								settingsPopup.set(false);
							}}>Read <ExternalLink size={20} strokeWidth={2.5} class="ml-1" /></Button
						>
					</div>
				</div>
				<!-- Credits -->
				<div class="flex items-center gap-10 justify-between">
					<label for="legal-info" class="text-base font-semibold">Credits</label>
					<div class="w-1/2 flex">
						<Button
							onclick={() => {
								settingsPopup.set(false);
								creditsPopup.set(true);
							}}>View <ExternalLink size={20} strokeWidth={2.5} class="ml-1" /></Button
						>
					</div>
				</div>
			</div>
		</div>
	</Popup>
{/if}
