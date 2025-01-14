<script>
	import { settingsPopup } from "$lib/stores/uiStore";
	import Popup from "./Popup.svelte";
	import Toggle from "./Toggle.svelte";
	import Button from "./Button.svelte";
	import { ExternalLink, Scan } from "lucide-svelte";
	import { goto } from "$app/navigation";
</script>

{#if $settingsPopup}
	<Popup
		title="Settings"
		small={true}
		closeFunction={() => {
			settingsPopup.set(false);
		}}
	>
		<div class="flex h-full items-end mt-20">
			<div class="h-4/6 w-full p-4 flex flex-col gap-5">
				<div class="flex items-center gap-10 justify-between">
					<label for="volume-slider" class="text-base font-semibold">Volume</label>
					<div class="w-1/2">
						<input type="range" id="volume-slider" min="0" max="100" value="50" step="10" class="slider" />
					</div>
				</div>
				<div class="flex items-center gap-10 justify-between">
					<label for="music" class="text-base font-semibold">Music</label>
					<div class="w-1/2 flex">
						<Toggle />
					</div>
				</div>
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
			</div>
		</div></Popup
	>
{/if}
