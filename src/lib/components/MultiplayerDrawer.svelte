<script>
	import { currentPlayers, peer } from "$lib/stores/multiplayerStore";
	import { ChevronsLeft, Skull } from "lucide-svelte";
	import { flip } from "svelte/animate";
	import { gsap } from "gsap";
	import Flip from "gsap/dist/Flip";
	import { getPlayerInfo, isPlayerInGame } from "$lib/utils/multiplayer";
	import Button from "./Button.svelte";
	gsap.registerPlugin(Flip);

	let multiplayerDrawerFlag = $state(false);
	let drawerElement = $state();

	function handleDrawerToggle() {
		const drawerState = Flip.getState(".drawer");

		const rightValue = !multiplayerDrawerFlag ? "1rem" : "-100%";
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
	class="bg-defaultShadow relative w-full h-full p-2.5 rounded-lg drawer"
	style="right: -100%"
	bind:this={drawerElement}
>
	<div class="absolute top-1/2 -translate-y-1/2 -z-10 rounded-l-2xl left-0 -translate-x-full bg-defaultShadow p-2.5">
		<Button buttonHeight="7rem" buttonWidth="3rem" shadowHeight="0.33rem" onclick={handleDrawerToggle}>
			<div class="arrow-icon">
				<ChevronsLeft strokeWidth={3} size={30} color="var(--white)" />
			</div>
		</Button>
	</div>
	<div class="w-full h-full">
		<div class="bg-tanLight rounded text-center mb-2.5 p-2">
			<span class="text-2xl text-orange font-semibold">Players</span>
		</div>
		<div class="bg-white w-full max-h-96 rounded px-2 overflow-x-hidden overflow-y-auto no-last-border">
			{#each $currentPlayers as element (element)}
				<!-- Flip animation works in Firefox but not in chrome for some reason. Maybe try GSAP? -->
				<div
					animate:flip={{}}
					class="w-full md:min-w-64 md:max-w-80 flex justify-between p-2.5 text-center text-base text-black truncate border-b-[3px] border-tanDark"
					style:font-weight={element.id == $peer.id ? 600 : ""}
				>
					<p class="overflow-clip text-ellipsis px-4 w-5/6">
						{getPlayerInfo(element.id).name}
					</p>
					<p class="min-w-10 flex justify-center items-center relative">
						{#if !isPlayerInGame(element.id)}
							<span class="absolute left-0 -translate-x-3/4">
								<Skull strokeWidth={2.5} color={"var(--black)"} />
							</span>
						{/if}
						{element.score}
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.no-last-border > div:last-child {
		border-bottom: none !important;
	}
</style>
