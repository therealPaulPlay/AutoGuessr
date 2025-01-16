<script>
	import { onMount } from "svelte";
	import { tick } from "svelte";
	import { fade, fly } from "svelte/transition";
	import { gsap } from "gsap";
	import Button from "$lib/components/Button.svelte";
	import CardBack from "$lib/components/CardBack.svelte";
	import Card from "$lib/components/Card.svelte";
	import Flip from "gsap/dist/Flip";
	gsap.registerPlugin(Flip);
	import { score } from "$lib/stores/gameStore";

	let cardInfo = {
		name: "TestName 1",
		HP: 400,
		price: 45000,
		etype: "V10",
		date: "2024",
		rarity: "mystical",
		image: "/assets/img/example/cardcar.png",
	};

	let cardWidth = $state();
	let containerWidth = $state();
	let windowWidth = $state();
	let showRevealButton = $state(false);
	let showCardBack = $state(false);
	let disableRollButton = $state(false);
	let removeRollButton = $state(false);
	let raritiesSize = 40;
	let cardsOnRight = 3; // For some reason 0 breaks it. Not sure why
	let cardPositionIndex = raritiesSize - 1 - cardsOnRight;
	let rarityBonusValue = Math.pow($score, 2);

	let rarities = getRarityWithBonus(rarityBonusValue, cardPositionIndex, cardInfo, raritiesSize);

	function getRarityWithBonus(bonusValue, cardPositionIndex, cardInfo, raritiesSize) {
		// Cap the bonus value between 0 and 100
		const cappedBonus = Math.min(Math.max(bonusValue, 0), 100);
		const rarities = [];

		// Base probabilities (when bonus is 0)
		const baseProbs = {
			common: 50,
			rare: 20,
			epic: 20,
			legendary: 8,
			mystical: 2,
		};

		// Calculate scaling factor based on bonus
		// As bonus increases, we decrease common/rare chances and increase epic/legendary/mystical
		const scalingFactor = cappedBonus / 100;

		// Adjust probabilities based on bonus
		const adjustedProbs = {
			common: baseProbs.common * (1 - scalingFactor * 0.8), // Reduce commons significantly
			rare: baseProbs.rare * (1 - scalingFactor * 0.5), // Reduce rares moderately
			epic: baseProbs.epic * (1 + scalingFactor), // Increase epics
			legendary: baseProbs.legendary * (1 + scalingFactor * 2), // Increase legendaries more
			mystical: baseProbs.mystical * (1 + scalingFactor * 3), // Increase mysticals most
		};

		// Calculate cumulative thresholds
		const thresholds = {
			common: adjustedProbs.common,
			rare: adjustedProbs.common + adjustedProbs.rare,
			epic: adjustedProbs.common + adjustedProbs.rare + adjustedProbs.epic,
			legendary: adjustedProbs.common + adjustedProbs.rare + adjustedProbs.epic + adjustedProbs.legendary,
			mystical: 100, // Remainder goes to mystical
		};

		for (let i = 0; i < raritiesSize; i++) {
			if (i === cardPositionIndex) {
				rarities.push(cardInfo.rarity);
				continue;
			}

			const number = Math.floor(Math.random() * 100);

			switch (true) {
				case number < thresholds.common:
					rarities.push("common");
					break;
				case number < thresholds.rare:
					rarities.push("rare");
					break;
				case number < thresholds.epic:
					rarities.push("epic");
					break;
				case number < thresholds.legendary:
					rarities.push("legendary");
					break;
				default:
					rarities.push("mystical");
					break;
			}
		}

		return rarities;
	}

	function scrollToEnd() {
		if (disableRollButton) return;
		const container = document.querySelector(".scroll-container");

		// 1. Scroll the container all the way to the left (the right side of the container is on the left side of the screen)
		// 2. Move the container to the right by the half width of the screen
		// 3. Move the container to the right by the half width of the card
		// 4. For any addtional cards on the right, move the container to the right by the width of the card and add 8px for the gap (gap-2 in Tailwindcss)
		disableRollButton = true;
		gsap
			.to(container, {
				x: -(container.scrollWidth - windowWidth / 2 - cardWidth / 2 - cardsOnRight * (cardWidth + 8)),
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
	}

	function initialCenterCards() {
		const container = document.querySelector(".scroll-container");
		gsap.to(container, {
			x: windowWidth / 2 - cardWidth / 2,
			duration: 0.5,
			ease: "power2.inOut",
		});
	}

	onMount(() => {
		initialCenterCards();
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
			<div bind:clientWidth={containerWidth} class="flex flex-row items-center w-fit scroll-container gap-2 my-5">
				{#each rarities as rarity, i}
					{#if i === cardPositionIndex}
						<div
							bind:clientWidth={cardWidth}
							class="flex-shrink-0 z-10 transition-all duration-700 w-fit relative [transform-style:preserve-3d] h-96"
							class:flip-it={showCardBack}
							style:width="{cardWidth}px"
							id="card_{i}"
						>
							<div class="absolute w-full h-full [backface-visibility:hidden]">
								<CardBack {rarity} />
							</div>
							<div class="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
								<Card {...cardInfo} />
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
			<div
				class="fixed w-full h-full rays"
				in:fade={{duration: 300, delay: 500}}
                out:fade={{duration: 150}}
			></div>
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

    /* TODO: Make it more visible on mobile phones */
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
