<script>
	import { onMount } from "svelte";
	import { derived } from "svelte/store";

	let { name = "N/A", HP = 0, price = 0, etype = "N/A", date = "N/A", rarity = "common", image = "" } = $props();

	// let componentWidth = $state();
	// let w = $derived(componentWidth * scaleFactor);
	let w = $state();
	let h = $state();
	let titleSize = $derived(0.1 * w);
	let statSize = $derived(0.038 * w);
	let statPadding = $derived(0.1 * w);
	let rowGap = $derived(0.064 * h);
	let colGap = $derived(0.2 * w);
	let statTop = $derived(0.433 * h);
	let imgPadding = $derived(0.1 * w);

	const splitThreshold = 15;

	let splitParts = $derived.by(() => {
		if (!name || name.length < splitThreshold) return null;

		const midpoint = Math.floor(name.length / 2);
		let splitIndex = -1;

		// Look for spaces BOTH before and after midpoint
		for (let i = midpoint; i >= 0; i--) {
			if (name[i] === " ") {
				splitIndex = i;
				break;
			}
		}

		// If no space found before midpoint, look after
		if (splitIndex === -1) {
			for (let i = midpoint; i < name.length; i++) {
				if (name[i] === " ") {
					splitIndex = i;
					break;
				}
			}
		}

		if (splitIndex !== -1) {
			return [name.slice(0, splitIndex), name.slice(splitIndex + 1)];
		}
		return null; // No space found at all
	});
</script>

<div class="w-full h-full relative" bind:clientWidth={w} bind:clientHeight={h}>
	<img src="/assets/svg/{rarity}_front.svg" alt="Card" class="w-full h-full" />
	<div class="absolute top-0 left-0 w-full h-full flex flex-col justify-between items-center">
		<div class="title-size flex items-center absolute px-5 h-2/5" style:top="10px">
			{#if splitParts}
				<!-- Split version -->
				<div class="split-container flex flex-col content-center gap-2 z-20 items-center">
					{#each splitParts as part}
						<div class="text-column relative flex content-center">
							<h1 class="text-white font-bold font-batuphat text-center" style={`font-size: ${titleSize}px`}>
								{part}
							</h1>
							<h1
								class="{rarity}-extrude absolute -z-10 top-0 font-bold font-batuphatExtrude text-center"
								style={`font-size: ${titleSize}px`}
							>
								{part}
							</h1>
						</div>
					{/each}
				</div>
			{:else}
				<!-- Original version -->
				<h1 class="z-20 text-white font-bold font-batuphat text-center" style={`font-size: ${titleSize}px`}>
					{name}
				</h1>
				<h1
					class="{rarity}-extrude absolute z-10 font-bold font-batuphatExtrude text-center"
					style={`font-size: ${titleSize}px`}
				>
					{name}
				</h1>
			{/if}
		</div>
		<div
			class="w-4/6 {rarity} grid grid-cols-2 items-center absolute"
			style="padding-left: {statPadding}px; gap: {rowGap}px {colGap}px; top:{statTop}px"
		>
			<p class="font-bold text-nowrap overflow-hidden" style="font-size: {statSize}px">
				{HP} HP
			</p>
			<p class="font-bold text-nowrap overflow-hidden" style="font-size: {statSize}px">
				${price.toLocaleString()}
			</p>
			<p class="font-bold text-nowrap overflow-hidden" style="font-size: {statSize}px">
				{etype}
			</p>
			<p class="font-bold text-nowrap overflow-hidden" style="font-size: {statSize}px">
				{date}
			</p>
		</div>
		<div class="h-2/5 absolute grid place-items-center" style="bottom: {0}px; padding: {imgPadding}px;">
			{#if image}
				<div class="relative inline-block">
					<!-- Image wrapper -->
					<img src={image} alt="Car" class="relative z-10 max-h-full" />
					<div class="car-shadow"></div>
				</div>
			{:else}
				<p>image loading...</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.title-size h1 {
		font-size: calc(1rem + 1vw);
	}

	.car-shadow {
		position: absolute;
		bottom: -5%; /* Position below the car */
		left: 50%;
		transform: translateX(-50%) scaleX(1.5); /* Wider horizontal scaling */
		width: 70%; /* Base width before scaling */
		height: 30%; /* Ellipse height */
		background-color: rgba(0, 0, 0, 0.4); /* Solid color with opacity */
		border-radius: 50%; /* Create ellipse shape */
		z-index: 1;
		opacity: 0.7;
	}

	/* Ensure image container scales with content */
	.relative.inline-block {
		max-width: 100%;
		max-height: 100%;
	}

	.split-container {
		gap: 0px; /* Adjust spacing between columns */
	}

	.mystical p {
		color: var(--mystical);
	}
	.mystical-extrude {
		color: var(--extrude-mystical);
	}

	.legendary p {
		color: var(--legendary);
	}
	.legendary-extrude {
		color: var(--extrude-legendary);
	}

	.epic p {
		color: var(--epic);
	}
	.epic-extrude {
		color: var(--extrude-epic);
	}

	.rare p {
		color: var(--rare);
	}
	.rare-extrude {
		color: var(--extrude-rare);
	}

	.common p {
		color: var(--common);
	}
	.common-extrude {
		color: var(--extrude-common);
	}
</style>
