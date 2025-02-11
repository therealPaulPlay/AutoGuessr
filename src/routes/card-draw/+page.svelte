<script>
	import { onMount } from "svelte";
	import { tick } from "svelte";
	import { draw, fade, fly } from "svelte/transition";
	import { gsap } from "gsap";
	import Button from "$lib/components/Button.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import CardBack from "$lib/components/CardBack.svelte";
	import Card from "$lib/components/Card.svelte";
	import Flip from "gsap/dist/Flip";
	import { score, drawCardFlag } from "$lib/stores/gameStore";
	import { isAuthenticated } from "$lib/stores/accountStore";
	import { goto } from "$app/navigation";
	import { cardDraw, calculateRarity } from "$lib/utils/cardDraw";
	import { saveAutocard } from "$lib/utils/handleAutocards";
	gsap.registerPlugin(Flip);

	let cardInfo = $state();

	let scrollContainer = $state();
	let cardWidth = $state();
	let containerWidth = $state();
	let windowWidth = $state();
	let showRevealButton = $state(false);
	let disableRevealButton = $state(false);
	let showGameEnd = $state(false);
	let disableRollButton = $state(false);
	let removeRollButton = $state(false);
	let showCardBack = $state(false);
	let alreadyUnlocked = $state(false);
	let drawNotAllowedPopup = $state(false);

	const raritiesSize = 40;
	const cardsOnRight = 3; // For some reason 0 breaks it. Not sure why

	let rarities = $state(null);
	let mainCard = $state();

	function getRarityWithBonus(cardInfo, raritiesSize) {
		const cappedBonus = Math.min(Math.max(Math.pow($score, 1.2), 0), 100);
		const rarities = [];

		for (let i = 0; i < raritiesSize; i++) {
			if (i === raritiesSize - cardsOnRight - 1) {
				rarities.push(cardInfo.rarity);
				continue;
			}

			rarities.push(calculateRarity(cappedBonus));
		}

		return rarities;
	}

	function scrollToEnd() {
		if (disableRollButton) return;

		// 1. Scroll the container all the way to the left (the right side of the container is on the left side of the screen)
		// 2. Move the container to the right by the half width of the screen
		// 3. Move the container to the right by the half width of the card
		// 4. For any addtional cards on the right, move the container to the right by the width of the card and add 8px for the gap (gap-2 in Tailwindcss)
		disableRollButton = true;
		gsap
			.to(scrollContainer, {
				x: -(scrollContainer.scrollWidth - windowWidth / 2 - cardWidth / 2 - cardsOnRight * (cardWidth + 8)),
				duration: 4,
				ease: "power2.inOut",
			})
			.then(() => {
				removeRollButton = true;
				setTimeout(() => {
					showRevealButton = true;
				}, 150);
			});
	}

	function revealCard() {
		showCardBack = !showCardBack;

		setTimeout(() => {
			showRevealButton = false;
			showGameEnd = true;
		}, 500);
	}

	function initialCenterCards() {
		gsap.to(scrollContainer, {
			x: windowWidth / 2 - cardWidth / 2,
			duration: 0.5,
			ease: "power2.inOut",
		});
	}

	onMount(async () => {
		if ($drawCardFlag) {
			cardInfo = await cardDraw();
			if (cardInfo && !saveAutocard(cardInfo)) alreadyUnlocked = true;
			rarities = getRarityWithBonus(cardInfo, raritiesSize);
			drawCardFlag.set(false);
		} else {
			drawNotAllowedPopup = true;
		}
	});

	$effect(() => {
		if (cardWidth > 1) initialCenterCards();
	});

	let resizeTimeout;
</script>

<svelte:head>
	<title>Draw a Card</title>
</svelte:head>

<!-- window size -->
<svelte:window
	bind:innerWidth={windowWidth}
	onresize={() => {
		clearTimeout(resizeTimeout);

		resizeTimeout = setTimeout(() => {
			initialCenterCards();
		}, 100);
	}}
/>
<content class="relative h-full block">
	<div class="flex flex-col w-full h-full justify-center items-center overflow-hidden">
		<div>
			<img src="/assets/svg/arrow.svg" alt="Arrow" class="w-8 h-8 -rotate-90" />
		</div>
		<div class="fade-mask w-full">
			<div
				bind:clientWidth={containerWidth}
				bind:this={scrollContainer}
				class="flex flex-row items-center w-fit scroll-container gap-2 my-5"
			>
				{#each rarities as rarity, i}
					{#if i === raritiesSize - cardsOnRight - 1}
						<div
							bind:this={mainCard}
							class="flex-shrink-0 z-10 transition-all duration-700 w-fit relative [transform-style:preserve-3d] h-96"
							class:flip-it={showCardBack}
							style:width="{cardWidth}px"
							id="card_{i}"
						>
							<div class="absolute w-full h-full [backface-visibility:hidden]">
								<CardBack {rarity} />
							</div>
							<div class="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
								<div class:dark={alreadyUnlocked}>
									<Card {...cardInfo} />
								</div>
								{#if alreadyUnlocked}
									<div
										transition:fade={{ duration: 300, delay: 500 }}
										class="w-full h-full absolute bottom-0 left-0 flex items-center justify-center z-50"
									>
										<span
											class="rounded-lg px-3 py-2 bg-white font-bold text-sm text-center"
											style:color="var(--extrude-{rarity})">Already unlocked!</span
										>
									</div>
								{/if}
							</div>
						</div>
					{:else}
						<div
							bind:clientWidth={cardWidth}
							class="flex-shrink-0 z-10 transition-all ease-in-out delay-300 h-96"
							class:dim={showCardBack}
							id="card_{i}"
						>
							<CardBack {rarity} />
						</div>
					{/if}
				{/each}
			</div>
		</div>
		<div>
			<img src="/assets/svg/arrow.svg" alt="Arrow" class="w-8 h-8 rotate-90 scale-y-[-1]" />
		</div>
		{#if showCardBack}
			<div class="fixed w-full h-full rays" in:fade={{ duration: 300, delay: 500 }} out:fade={{ duration: 150 }}></div>
		{/if}
		<!-- Minimum height should be the same as the button height to avoid "snapping" artifacts -->
		<div class="mt-5 flex flex-row gap-5 min-h-16">
			{#if !removeRollButton}
				<div class="min-w-[12rem]" out:fly={{ y: 50, duration: 150 }}>
					<Button buttonHeight="4rem" buttonWidth="12rem" shadowHeight="0.5rem" onclick={scrollToEnd}>
						<span class="text-white font-bold text-3xl">Roll!</span>
					</Button>
				</div>
			{/if}
			{#if showRevealButton}
				<div in:fly={{ y: 50, duration: 150 }}>
					<Button
						buttonHeight="4rem"
						buttonWidth="12rem"
						shadowHeight="0.5rem"
						color="var(--green-button)"
						bgcolor="var(--green-button-dark)"
						onclick={revealCard}
					>
						<span class="text-white font-bold text-3xl">Reveal!</span>
					</Button>
				</div>
			{/if}
			{#if showGameEnd}
				<div in:fly={{ y: 50, duration: 150 }}>
					<Button
						buttonHeight="4rem"
						buttonWidth="14rem"
						shadowHeight="0.5rem"
						onclick={() => {
							goto("/game/end");
						}}
					>
						<span class="text-white font-bold text-3xl">Summary</span>
					</Button>
				</div>
			{/if}
		</div>
	</div>
	<div class="absolute w-full h-full top-0 left-0 -z-50">
		<img src="/assets/svg/question mark.svg" alt="Background question mark" class="absolute h-52 bottom-10 rotate-12" />
		<img
			src="/assets/svg/question mark.svg"
			alt="Background question mark"
			class="absolute h-36 bottom-10 left-36 rotate-45"
		/>
		<img
			src="/assets/svg/question mark.svg"
			alt="Background question mark"
			class="absolute h-36 -top-32 left-72 -rotate-12 scale-y-[-1] scale-x-[-1]"
		/>
		<img
			src="/assets/svg/question mark.svg"
			alt="Background question mark"
			class="absolute h-24 -top-32 left-56 scale-y-[-1] scale-x-[-1]"
		/>
		<img
			src="/assets/svg/question mark.svg"
			alt="Background question mark"
			class="absolute h-28 bottom-20 right-8 -rotate-12"
		/>
	</div>
</content>

{#if drawNotAllowedPopup}
	<Popup showCloseButton={false} small={true}>
		<div class="flex flex-col items-center h-full justify-evenly">
			<p
				class="text-black
			text-base
			text-center
			"
			>
				<span class="font-semibold">No card draw available!</span> In order to draw a card, you need to play a game first.
			</p>
			<div class="flex gap-16 mt-10">
				<Button
					buttonHeight="4rem"
					buttonWidth="7rem"
					color="var(--default-button)"
					bgcolor="var(--default-button-dark)"
					onclick={() => {
						goto("/");
					}}
				>
					<span
						class="text-white
					font-medium
					text-xl">Okay</span
					>
				</Button>
			</div>
		</div>
	</Popup>
{/if}

<style>
	.scroll-container {
		scrollbar-width: none; /* Hide scrollbar for Firefox */
	}

	.flip-it {
		transform: rotateY(180deg) scale(1.1);
		z-index: 100;
	}

	.dim {
		filter: brightness(0.5) opacity(0.5);
		z-index: -20;
	}

	.dark {
		filter: brightness(0.7) saturate(0.7);
	}

	.rays {
		z-index: -10;
		scale: 1.7;
		pointer-events: none;
		background: url("/assets/svg/rays.svg") no-repeat center;
		translate: 0 -2.5rem;
		animation: rotate 8s linear infinite;
		opacity: 0.6;

		mask-image: radial-gradient(circle, rgba(255, 255, 255, 1) 10%, rgba(0, 0, 0, 0) 30%);
		mask-composite: intersect;
		-webkit-mask-image: radial-gradient(circle, rgba(255, 255, 255, 1) 10%, rgba(0, 0, 0, 0) 30%);
		-webkit-mask-composite: intersect;
	}

	/* make rays larger for phone screen */
	@media (max-width: 768px) {
		.rays {
			scale: 2.5;
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@media (min-width: 768px) {
		.fade-mask {
			mask-image: radial-gradient(circle, rgba(255, 255, 255, 1) 20%, rgba(0, 0, 0, 0) 80%);
			mask-composite: intersect;
		}
	}
</style>
