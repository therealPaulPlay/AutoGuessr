<script>
	import { onMount, onDestroy } from "svelte";
	import Card from "$lib/components/Card.svelte";
	import { windowWidth } from "$lib/stores/uiStore";
	import { carsList } from "$lib/stores/carsStore";
	import { userCars } from "$lib/stores/accountStore";
	import { get } from "svelte/store";
	import { updateAutocardsList } from "$lib/utils/handleAutocards";

	let MAX_CARDS_FILL = 25;

	onMount(updateAutocardsList);
	let cards = $state([]);

	let selectedCard = $state(0);
	let windowHeight = $state();
	let container;
	let cardElement = $state();
	let cardWidth = $state(0);

	$effect(() => {
		if (cardElement) {
			cardWidth = cardElement.clientWidth;
		}
	});

	function centerCard() {
		const card = document.getElementById(`card_${selectedCard}`);
		if (!card) return;

		handleTransitionEnd(card);
	}

	function handleTransitionEnd(card) {
		if (!card || !container) return;

		const containerWidth = container.clientWidth;
		const cardOffsetLeft = card.offsetLeft;
		const cardWidth = card.clientWidth;
		const scrollPosition = cardOffsetLeft - containerWidth / 2 + cardWidth / 2;

		// Smoothly scroll to the position
		container.scrollTo({
			left: scrollPosition,
			behavior: "smooth",
		});
	}

	function handleWheel(event) {
		if (!container) return;
		event.preventDefault();
		container.scrollLeft += event.deltaY;
	}

	function generateCards() {
		let currentLength = cards.length;
		let fillLength = MAX_CARDS_FILL - currentLength;
		fillLength = fillLength > 0 ? fillLength : 0; // Prevent negative fillLength

		for (let i = 0; i < fillLength; i++) {
			cards.push({ rarity: "locked" });
		}
	}

	function orderCards() {
		const rarityOrder = ["common", "rare", "epic", "legendary", "mystical", "locked"];

		// Sort the array based on the defined order
		cards.sort((a, b) => {
			const aIndex = rarityOrder.indexOf(a.rarity);
			const bIndex = rarityOrder.indexOf(b.rarity);
			return aIndex - bIndex;
		});
	}

	onMount(() => {
		if (container) {
			container.addEventListener("wheel", handleWheel, { passive: false });
		}
	});

	onMount(() => {
		cards = get(userCars);
		generateCards();
		orderCards();
	});

	onDestroy(() => {
		if (container) container.removeEventListener("wheel", handleWheel);
	});
</script>

<svelte:window bind:innerWidth={$windowWidth} bind:innerHeight={windowHeight} />

<svelte:head>
	<title>AutoCards</title>
</svelte:head>

<main class="flex h-[80vh] items-center relative">
	<div
		bind:this={container}
		class="overflow-x-scroll overflow-y-hidden w-full relative h-full content-end overscroll-none px-14 md:px-96"
		style="scrollbar-width: none;"
	>
		<div class="grid grid-flow-col gap-5 w-fit items-center h-full">
			{#each cards as card, i}
				<div bind:this={cardElement} class="min-w-72 transition-all ease-in-out delay-150" id="card_{i}">
					{#if card.rarity === "locked"}
						<img src="/assets/svg/locked.svg" alt="Card" class="w-full h-full" />
					{:else}
						<Card {...card} />
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<div class="fixed h-full w-full -z-10">
		<img
			src="/assets/svg/gears big.svg"
			alt="background gear"
			class="fixed top-[-10rem] left-[25rem] rotate-45"
			style:width="{0.4 * windowHeight}px"
		/>
		<img
			src="/assets/svg/gears big.svg"
			alt="background gear"
			class="fixed bottom-[-10rem] left-[-10rem]"
			style:width="{0.5 * windowHeight}px"
		/>
		<img
			src="/assets/svg/gears big.svg"
			alt="background gear"
			class="fixed bottom-[-5rem] right-[-5rem] -rotate-45 transition max-md:opacity-0"
			style:width="{0.3 * windowHeight}px"
		/>
	</div>
</main>

<style>
	div[id^="card_"]:hover {
		transform: scale(1.1);
		z-index: 90;
		transition: transform 150ms ease;
	}
</style>
