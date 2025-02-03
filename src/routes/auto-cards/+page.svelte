<script>
	import { onMount, onDestroy } from "svelte";
	import Card from "$lib/components/Card.svelte";
	import { windowWidth } from "$lib/stores/uiStore";

	let cards = [
		// Common Cars
		{
			name: "Ford Focus ST",
			HP: 280,
			price: 35000,
			etype: "I4 Turbo",
			date: "2020",
			rarity: "common",
			image: "/assets/img/cars/Ford Focus ST.webp",
		},
		{
			name: "Mazda Miata MX-5 (NA)",
			HP: 116,
			price: 15000,
			etype: "I4",
			date: "1990",
			rarity: "common",
			image: "/assets/img/cars/Mazda Miata MX-5 (NA).webp",
		},
		{
			name: "Mini Cooper S",
			HP: 189,
			price: 32000,
			etype: "I4 Turbo",
			date: "2022",
			rarity: "common",
			image: "/assets/img/cars/Mini Cooper S.webp",
		},
		{
			name: "Toyota RAV4 (4th Gen)",
			HP: 203,
			price: 28000,
			etype: "I4",
			date: "2018",
			rarity: "common",
			image: "/assets/img/cars/Toyota RAV4 (4th Gen).webp",
		},
		{
			name: "Volkswagen Golf GTI",
			HP: 228,
			price: 30000,
			etype: "I4 Turbo",
			date: "2019",
			rarity: "common",
			image: "/assets/img/cars/Volkswagen Golf GTI.webp",
		},

		// Rare Cars
		{
			name: "BMW i3",
			HP: 170,
			price: 45000,
			etype: "Electric",
			date: "2013",
			rarity: "rare",
			image: "/assets/img/cars/BMW i3.webp",
		},
		{
			name: "Maserati Ghibli",
			HP: 424,
			price: 85000,
			etype: "V6 Turbo",
			date: "2022",
			rarity: "rare",
			image: "/assets/img/cars/Maserati Ghibli.webp",
		},
		{
			name: "Mercedes A-Class",
			HP: 221,
			price: 40000,
			etype: "I4 Turbo",
			date: "2023",
			rarity: "rare",
			image: "/assets/img/cars/mercedes a class.webp",
		},
		{
			name: "Porsche Cayenne",
			HP: 335,
			price: 75000,
			etype: "V6 Turbo",
			date: "2023",
			rarity: "rare",
			image: "/assets/img/cars/Porsche Cayenne.webp",
		},
		{
			name: "Range Rover Evoque",
			HP: 246,
			price: 55000,
			etype: "I4 Turbo",
			date: "2023",
			rarity: "rare",
			image: "/assets/img/cars/Range Rover Evoque.webp",
		},

		// Epic Cars
		{
			name: "Audi R8 V8",
			HP: 430,
			price: 115000,
			etype: "V8",
			date: "2007",
			rarity: "epic",
			image: "/assets/img/cars/Audi R8 V8.webp",
		},
		{
			name: "BMW 6 Series",
			HP: 445,
			price: 78000,
			etype: "V8",
			date: "2018",
			rarity: "epic",
			image: "/assets/img/cars/BMW 6 Series.webp",
		},
		{
			name: "Dodge Viper GTS",
			HP: 450,
			price: 85000,
			etype: "V10",
			date: "1996",
			rarity: "epic",
			image: "/assets/img/cars/Dodge Viper GTS.webp",
		},
		{
			name: "Bentley Flying Spur Mulliner",
			HP: 626,
			price: 225000,
			etype: "W12",
			date: "2022",
			rarity: "epic",
			image: "/assets/img/cars/Flying Spur Mulliner.webp",
		},
		{
			name: "Ford Mustang Dark Horse",
			HP: 500,
			price: 60000,
			etype: "V8",
			date: "2024",
			rarity: "epic",
			image: "/assets/img/cars/Ford Mustang Dark Horse.webp",
		},

		// Legendary Cars
		{
			name: "Aston Martin V12 Vantage S",
			HP: 565,
			price: 180000,
			etype: "V12",
			date: "2013",
			rarity: "legendary",
			image: "/assets/img/cars/Aston Martin V12 Vantage S.webp",
		},
		{
			name: "Ferrari F12 Berlinetta",
			HP: 730,
			price: 330000,
			etype: "V12",
			date: "2012",
			rarity: "legendary",
			image: "/assets/img/cars/Ferrari F12 Berlinetta.webp",
		},
		{
			name: "Lamborghini Temerario",
			HP: 814,
			price: 400000,
			etype: "V12 Hybrid",
			date: "2024",
			rarity: "legendary",
			image: "/assets/img/cars/Lamborghini Temerario.webp",
		},
		{
			name: "Nissan Skyline GT-R (R34)",
			HP: 276,
			price: 120000,
			etype: "I6 Turbo",
			date: "1999",
			rarity: "legendary",
			image: "/assets/img/cars/Nissan Skyline GT-R (R34).webp",
		},
		{
			name: "Porsche 911",
			HP: 473,
			price: 130000,
			etype: "Flat-6 Turbo",
			date: "2023",
			rarity: "legendary",
			image: "/assets/img/cars/Porsche 911.webp",
		},

		// Mystical Cars
		{
			name: "Bugatti Tourbillon",
			HP: 1800,
			price: 5000000,
			etype: "Hybrid V16",
			date: "2024",
			rarity: "mystical",
			image: "/assets/img/cars/Bugatti Tourbillon.webp",
		},
		{
			name: "Ferrari F40",
			HP: 471,
			price: 1500000,
			etype: "V8",
			date: "1987",
			rarity: "mystical",
			image: "/assets/img/cars/Ferrari F40.webp",
		},
		{
			name: "McLaren F1",
			HP: 627,
			price: 20000000,
			etype: "V12",
			date: "1992",
			rarity: "mystical",
			image: "/assets/img/cars/McLaren F1.webp",
		},
		{
			name: "Miura P400 SV",
			HP: 385,
			price: 4000000,
			etype: "V12",
			date: "1971",
			rarity: "mystical",
			image: "/assets/img/cars/Miura P400 SV.webp",
		},
		{
			name: "Porsche 959 S",
			HP: 515,
			price: 2000000,
			etype: "Flat-6 Turbo",
			date: "1988",
			rarity: "mystical",
			image: "/assets/img/cars/Porsche 959 S.webp",
		}
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
