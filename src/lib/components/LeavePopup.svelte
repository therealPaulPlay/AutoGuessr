<script>
	import { leavePopup } from "$lib/stores/uiStore";
	import Popup from "./Popup.svelte";
	import Button from "./Button.svelte";
	import { goto } from "$app/navigation";
	import { multiplayerFlag } from "$lib/stores/multiplayerStore";
	import { leaveMultiplayerRoom } from "$lib/utils/multiplayer";
</script>

{#if $leavePopup}
	<Popup showCloseButton={false} small={true}>
		<div class="flex flex-col items-center h-full justify-evenly">
			<p
				class="text-black
                text-base
                text-center
                "
			>
				Are you sure you want to leave the game? <span class="font-semibold">Any progress will be lost.</span>
			</p>
			<div class="flex gap-16 mt-10">
				<Button
					buttonHeight="4rem"
					buttonWidth="7rem"
					color="var(--default-button)"
					bgcolor="var(--default-button-dark)"
					onclick={() => {
						if ($multiplayerFlag) leaveMultiplayerRoom();
						goto("/");
						$leavePopup = false;
					}}
				>
					<span
						class="text-white
                        font-medium
                        text-xl">Yes</span
					>
				</Button>
				<Button
					buttonHeight="4rem"
					buttonWidth="7rem"
					color="var(--green-button)"
					bgcolor="var(--green-button-dark)"
					onclick={() => ($leavePopup = false)}
				>
					<span
						class="text-white
                        font-medium
                        text-xl">No</span
					>
				</Button>
			</div>
		</div>
	</Popup>
{/if}
