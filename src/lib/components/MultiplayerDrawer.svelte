<script>
	import { currentPlayers, peer } from "$lib/stores/multiplayerStore";
	import { ChevronsLeft, Skull } from "lucide-svelte";
	import { flip } from "svelte/animate";
	import { gsap } from "gsap";
	import Flip from "gsap/dist/Flip";
	import { getPlayerInfo, isPlayerInGame } from "$lib/utils/multiplayer";
	gsap.registerPlugin(Flip);

	let multiplayerDrawerFlag = $state(false);
	let drawerElement = $state();

	function handleDrawerToggle() {
		const drawerState = Flip.getState(".drawer");

		const rightValue = !multiplayerDrawerFlag ? "1rem" : "-98%";
		drawerElement.style.right = rightValue;

		multiplayerDrawerFlag = !multiplayerDrawerFlag;

		gsap.to(".arrow-icon", { rotate: multiplayerDrawerFlag ? 180 : 0, duration: 0.5 });

		Flip.from(drawerState, {
			duration: 0.5,
			ease: "power3.inOut",
		});
	}

	$effect(() => {
		$currentPlayers.sort((a, b) => b.score - a.score);
	});
</script>

<div
	class="bg-defaultShadowDark relative w-full h-full p-1 rounded-lg drawer"
	style="right: -98%"
	bind:this={drawerElement}
>
	<button class="absolute top-3 -z-10 rounded-l-lg -left-11 bg-defaultShadowDark p-3" onclick={handleDrawerToggle}
		><div class="arrow-icon">
			<ChevronsLeft strokeWidth={3} color="var(--white)" />
		</div></button
	>
	<div class="bg-tanLight w-full max-h-96 rounded px-2 overflow-x-hidden overflow-y-auto no-last-border">
		{#each $currentPlayers as element (element)}
			<!-- Flip animation works in Firefox but not in chrome for some reason. Maybe try GSAP? -->
			<div
				animate:flip={{}}
				class="w-full md:min-w-64 md:max-w-80 flex justify-between p-1 text-center text-black truncate border-b-2 border-black/10"
				style:font-weight={element.id == $peer.id ? 600 : ""}
			>
				<p class="w-5/6 overflow-clip text-ellipsis flex justify-center items-center">
					{getPlayerInfo(element.id).name}
					{#if !isPlayerInGame(element.id)}
						&nbsp;<Skull strokeWidth={2.5} size={16} color={"var(--black)"} />
					{/if}
				</p>
				<p class="w-1/6">
					{element.score}
				</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.no-last-border > div:last-child {
		border-bottom: none !important;
	}
</style>
