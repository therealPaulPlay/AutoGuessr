<script>
	import { onMount, onDestroy } from "svelte";
	import Card from "$lib/components/Card.svelte";
	import { isAuthenticated, userCards } from "$lib/stores/accountStore";
	import { get } from "svelte/store";
	import { getCardCarList } from "$lib/utils/getCardCarList";
	import { browser } from "$app/environment";

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

	async function orderCards() {
		const carsList = await getCardCarList();
		let resultArray = new Array(carsList?.length);

		carsList?.forEach((car, index) => {
			const userCar = get(userCards).find((carId) => carId === car.id);
			userCar ? (resultArray[index] = car) : (resultArray[index] = { rarity: "locked" });
		});

		return resultArray;
	}

	userCards.subscribe(async (value) => {
		if (!browser) return;
		cards = await orderCards();
		generateCards();
	});
</script>

<svelte:window bind:innerHeight={windowHeight} />

<svelte:head>
	<title>AutoCards</title>
</svelte:head>

{#if !$isAuthenticated}
	<div
		class="rounded-xl bg-tanMedium w-fit p-0.5 px-2 mx-auto fixed bottom-4 left-0 right-0 text-nowrap text-center max-w-[90%] text-base"
	>
		<p class="text-ellipsis overflow-hidden">Sign in to sync your cards across devices!</p>
	</div>
{/if}

<content class="flex h-[80vh] items-center relative">
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
</content>

<style>
	div[id^="card_"]:hover {
		transform: scale(1.1);
		z-index: 90;
		transition: transform 150ms ease;
	}
</style>
