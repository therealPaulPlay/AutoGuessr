<script>
	import { onMount, onDestroy } from "svelte";
	import Card from "$lib/components/Card.svelte";
	import { carsList } from "$lib/stores/carsStore";
	import { userCars } from "$lib/stores/accountStore";
	import { get } from "svelte/store";

	const MAX_CARDS_FILL = 25;

	let cards = $state([]);

	let selectedCard = $state(0);
	let windowHeight = $state();
	let container;

	function handleWheel(event) {
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
		let resultArray = new Array(get(carsList).length);

		get(carsList).forEach((car, index) => {
			const userCar = get(userCars).find((userCar) => userCar.name === car.name);
			userCar ? (resultArray[index] = userCar) : (resultArray[index] = { rarity: "locked" });
		});

		return resultArray;
	}

	onMount(() => {
		// Load unlocked cards
		let autocards = JSON.parse(localStorage.getItem("autocards")) || [];
		userCars.set(autocards);

		cards = orderCards();
		generateCards();
	});
</script>

<svelte:window bind:innerHeight={windowHeight} />

<svelte:head>
	<title>AutoCards</title>
</svelte:head>

<main class="flex h-[80vh] items-center relative">
	<div
		bind:this={container}
		onwheel={handleWheel}
		class="overflow-x-scroll overflow-y-hidden w-full relative h-full content-end overscroll-none px-14 md:px-96"
		style="scrollbar-width: none;"
	>
		<div class="grid grid-flow-col gap-5 w-fit items-center h-full">
			{#each cards as card, i}
				<div class="min-w-72 transition-all ease-in-out delay-150" id="card_{i}">
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
