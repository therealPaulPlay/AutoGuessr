<script>
	import { currentPlayers } from "$lib/stores/multiplayerStore";
	import { ChevronsLeft } from "lucide-svelte";
	import { flip } from "svelte/animate";

	let multiplayerDrawerFlag = $state(false);

    $effect(() => {
        $currentPlayers.sort((a, b) => b.score - a.score);
    })
</script>

<div
	class="bg-defaultShadowDark relative w-full right-4 p-1 rounded-lg"
	style:height={multiplayerDrawerFlag ? "100%" : "8rem"}
	style:right={!multiplayerDrawerFlag ? "-0.25rem" : ""}
>
	<button
		class="absolute top-3 -z-10 rounded-l-lg -left-11 bg-defaultShadowDark p-3"
		onclick={() => {
			multiplayerDrawerFlag = !multiplayerDrawerFlag;
		}}><ChevronsLeft strokeWidth={3} color="var(--white)" /></button
	>
	{#if multiplayerDrawerFlag}
		<div class="bg-tanLight w-full max-h-96 rounded px-2 overflow-x-hidden overflow-y-auto">
			{#each $currentPlayers as ele (ele)}
            <!-- Flip animation works in Firefox but not in chrome for some reason. Maybe try GSAP? -->
				<div
					animate:flip={{}}
					class="w-full md:min-w-64 md:max-w-80 flex justify-between p-1 text-center text-black truncate border-b-2 border-black/10"
				>
					<p class="w-5/6 overflow-clip text-ellipsis">
						{ele.id}
					</p>
					<p class="w-1/6">
						{ele.score}
					</p>
				</div>
			{/each}
		</div>
	{/if}
</div>
