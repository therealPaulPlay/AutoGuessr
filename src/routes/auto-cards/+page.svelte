<script>
	import { onMount, onDestroy } from "svelte";
	import Card from "$lib/components/Card.svelte";
	import { windowWidth } from "$lib/stores/uiStore";

	let cards = [
		{
			name: "TestName 1",
			HP: 400,
			price: 45000,
			etype: "V10",
			date: "2024",
			rarity: "epic",
			image: "/assets/img/example/cardcar.png",
		},
		{
			rarity: "locked",
		},
		{
			name: "TestName 2",
			HP: 500,
			price: 50000,
			etype: "V12",
			date: "2024",
			rarity: "legendary",
			image: "/assets/img/example/cardcar.png",
		},
		{
			name: "TestName 3",
			HP: 350,
			price: 40000,
			etype: "V8",
			date: "2024",
			rarity: "rare",
			image: "/assets/img/example/cardcar.png",
		},
		{
			name: "TestName 4",
			HP: 300,
			price: 37500,
			etype: "V8",
			date: "2024",
			rarity: "mystical",
			image: "/assets/img/example/cardcar.png",
		},
		{
			name: "TestName 5",
			HP: 320,
			price: 36000,
			etype: "V8 Turbo",
			date: "2023",
			rarity: "rare",
			image: "/assets/img/example/cardcar.png",
		},
		{
			name: "TestName 6",
			HP: 450,
			price: 47000,
			etype: "V10 Turbo",
			date: "2023",
			rarity: "epic",
			image: "/assets/img/example/cardcar.png",
		},
		{
			name: "TestName 7",
			HP: 200,
			price: 25000,
			etype: "V6",
			date: "2024",
			rarity: "common",
			image: "/assets/img/example/cardcar.png",
		},
		{
			name: "TestName 8",
			HP: 310,
			price: 34000,
			etype: "V8",
			date: "2022",
			rarity: "rare",
			image: "/assets/img/example/cardcar.png",
		},
		{
			name: "TestName 9",
			HP: 600,
			price: 55000,
			etype: "V12",
			date: "2024",
			rarity: "legendary",
			image: "/assets/img/example/cardcar.png",
		},
		{
			name: "TestName 10",
			HP: 380,
			price: 42000,
			etype: "V8",
			date: "2023",
			rarity: "epic",
			image: "/assets/img/example/cardcar.png",
		},
	];

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

	onMount(() => {
		if (container) {
			container.addEventListener("wheel", handleWheel, { passive: false });

			// Set the margin right of the last card so that it can be scrolled to the center
			let lastCard = document.getElementById(`card_${cards.length - 1}`);
			if (lastCard) lastCard.style.marginRight = `${0.5 * $windowWidth - cardWidth / 2}px`;
		}
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
		class="overflow-x-scroll overflow-y-hidden w-full relative h-full content-end overscroll-none"
		style="scrollbar-width: none; padding-left: {0.5 * $windowWidth}px"
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
