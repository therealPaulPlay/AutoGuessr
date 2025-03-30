<script>
	import { peer } from "$lib/stores/multiplayerStore";
	import { getPlayerInfo } from "$lib/utils/multiplayer";

	let { array = [], emptyMessage } = $props();
</script>

<div class="w-full bg-tanDark rounded-lg px-3 overflow-y-auto max-h-[7.5rem] overflow-x-hidden no-last-border">
	{#if array.length > 0}
		{#each array as element}
			<div
				class="w-full py-1 text-center text-black truncate border-b-2 border-black/10"
				style:font-weight={element.id == $peer.id ? 600 : ""}
			>
				{getPlayerInfo(element.id)?.name}
			</div>
		{/each}
	{:else}
		<div class="w-full py-1 text-center text-black truncate border-b-2 border-black/10">
			{emptyMessage}
		</div>
	{/if}
</div>

<style>
	.no-last-border > div:last-child {
		border-bottom: none !important;
	}
</style>
