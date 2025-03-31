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
	let drawerClicked = $state(false);
	let drawerElement = $state();
	let buttonElement = $state();

	function handleDrawerToggle() {
		const drawerState = Flip.getState(".drawer");
		const buttonState = Flip.getState(".button-element");

		drawerClicked = !drawerClicked;
		multiplayerDrawerFlag = !multiplayerDrawerFlag;

		drawerElement.style.right = multiplayerDrawerFlag ? "1rem" : "-100%";
		buttonElement.style.left = drawerClicked ? "0.625rem" : "0px";
		
		gsap.to(".arrow-icon", { rotate: multiplayerDrawerFlag ? 180 : 0, duration: 0.5 });
		Flip.from(drawerState, { duration: 0.5, ease: "power3.inOut" });
		Flip.from(buttonState, { duration: 0.5, ease: "power3.inOut" });
	}

	$effect(() => {
		$currentPlayers.sort((a, b) => b.score - a.score);
	});
</script>

<div
	class="bg-defaultShadow relative w-full h-full p-2.5 rounded-2xl drawer"
	style="right: -100%"
	bind:this={drawerElement}
>
	<div
		class="button-element absolute top-1/2 -translate-y-1/2 -z-10 rounded-l-2xl left-0 -translate-x-full bg-defaultShadow p-2.5"
		bind:this={buttonElement}
	>
		<Button buttonHeight="7rem" buttonWidth="3rem" onclick={handleDrawerToggle}>
			<div class="arrow-icon">
				<ChevronsLeft strokeWidth={3} size={30} color="var(--white)" />
			</div>
		</Button>
	</div>
	<div class="w-full h-full bg-tanLight p-2.5 rounded-lg">
		<div class="bg-white w-full max-h-96 rounded-md px-2 overflow-x-hidden overflow-y-auto no-last-border">
			{#each [{ id: -1 }, ...$currentPlayers] as element, index (element.id)}
				<!-- Flip animation works in Firefox but not in chrome for some reason. Maybe try GSAP? -->
				<div
					animate:flip={{}}
					class="w-full md:min-w-64 flex justify-between p-2.5 text-center text-base text-black truncate border-b-[3px] border-tanDark"
					style:font-weight={element.id == $peer.id ? 600 : ""}
				>
					{#if index == 0}
						<div class="flex w-full justify-between overflow-clip text-black">
							<p>Name</p>
							<p class="flex justify-center items-center relative">
								Score {`(Round)`}
							</p>
						</div>
					{:else}
						<p class="overflow-clip text-ellipsis px-4 w-2/3">
							{getPlayerInfo(element.id).name}
						</p>
						<div class="w-1/3 flex justify-center items-center relative">
							<p class="mr-4">
								{element.score}
							</p>
							{#if !isPlayerInGame(element.id)}
								<div class="px-0.5">
									<Skull strokeWidth={2} color={"var(--black)"} />
								</div>
							{:else}
								{` (${element.round})`}
							{/if}
						</div>
					{/if}
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
