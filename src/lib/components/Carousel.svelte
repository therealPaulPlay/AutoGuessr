<script>
	import { onMount } from "svelte";
	import { currentCarouselIndex, imgElement } from "$lib/stores/gameStore";
	import { Howl } from "howler";
	import { formatSellerDescription } from "$lib/utils/formatDescription";
	import MapDisplay from "./MapDisplay.svelte";
	let { images = [], description = "No description was provided.", descriptionFlag = false } = $props();

	// References and state
	let container; // The main container for sizing
	let imageFit = $state(false); // Toggles object-fit between cover and contain

	// Zoom state
	let scale = $state(1);
	let translateX = $state(0);
	let translateY = $state(0);
	const MIN_SCALE = 1;
	const MAX_SCALE = 3;

	// Store container dimensions for clamping translations.
	let containerWidth = 0;
	let containerHeight = 0;
	function updateContainerSize() {
		if (container) {
			const rect = container.getBoundingClientRect();
			containerWidth = rect.width;
			containerHeight = rect.height;
			clampTranslation();
		}
	}

	// Ensure the image stays within the container.
	function clampTranslation() {
		// When scaled, the image is (scale * containerWidth) wide.
		// At scale 1, there is no extra image visible.
		// The extra width is containerWidth * (scale - 1) and should be divided equally on both sides.
		const maxX = (containerWidth * (scale - 1)) / 2;
		const maxY = (containerHeight * (scale - 1)) / 2;
		if (translateX > maxX) translateX = maxX;
		if (translateX < -maxX) translateX = -maxX;
		if (translateY > maxY) translateY = maxY;
		if (translateY < -maxY) translateY = -maxY;
	}

	// Reset zoom settings (called when the image loads or changes).
	function resetZoom() {
		scale = 1;
		translateX = 0;
		translateY = 0;
	}

	// Zooming via mouse wheel ---
	// A linear zoom: each wheel tick adjusts scale by a fixed factor.
	function handleWheel(e) {
		e.preventDefault();
		// Change scale by a fixed linear factor
		let newScale = scale - e.deltaY * 0.005;
		newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

		// Calculate a simple adjustment so that the pointer stays in place.
		const rect = container.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		// Offset of pointer from container center.
		const offsetX = e.clientX - centerX;
		const offsetY = e.clientY - centerY;
		// Linear interpolation: adjust translation proportionally to the scale change.
		const factor = newScale / scale;
		translateX = translateX * factor + offsetX * (1 - factor);
		translateY = translateY * factor + offsetY * (1 - factor);

		scale = newScale;
		clampTranslation();
	}

	// Navigate Carousel ---
	function next() {
		if (images.length > 1) {
			if ($imgElement) $imgElement.src = ""; // clear current image
			$currentCarouselIndex = ($currentCarouselIndex + 1) % images.length;
			new Howl({ src: ["/sounds/short_click.webm"] }).play();
			resetZoom();
		}
	}
	function prev() {
		if (images.length > 1) {
			if ($imgElement) $imgElement.src = "";
			$currentCarouselIndex = ($currentCarouselIndex - 1 + images.length) % images.length;
			new Howl({ src: ["/sounds/short_click.webm"] }).play();
			resetZoom();
		}
	}

	onMount(() => {
		updateContainerSize();
	});
</script>

<svelte:window onresize={updateContainerSize} />

<!-- Container -->
<div
	bind:this={container}
	class="flex w-full h-full relative rounded-2xl border-white border-8 bg-white overflow-hidden"
>
	<div class="relative w-full h-full flex items-center rounded-lg min-h-96">
		{#if !descriptionFlag}
			<!-- Navigation arrows -->
			<div class="z-10 w-full h-full flex flex-row justify-between items-center mx-4 pointer-events-none">
				<div class="w-16 h-16 flex justify-center bg-white rounded-full pr-2 pointer-events-auto">
					<button onclick={prev} class="transition active:scale-90">
						<img src="/assets/svg/arrow.svg" alt="Previous" class="w-8" />
					</button>
				</div>
				<div class="w-16 h-16 flex justify-center bg-white rounded-full pl-2 pointer-events-auto">
					<button onclick={next} class="transition active:scale-90">
						<img src="/assets/svg/arrow.svg" alt="Next" class="w-8 scale-x-[-1]" />
					</button>
				</div>
			</div>

			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<img
				src={images[$currentCarouselIndex]}
				alt=" "
				bind:this={$imgElement}
				onload={() => {
					resetZoom();
					updateContainerSize();
				}}
				onclick={() => {
					imageFit = !imageFit;
				}}
				onwheel={handleWheel}
				tabindex="0"
				role="button"
				class="absolute h-full w-full z-[5] cursor-crosshair rounded-lg transition ease-in-out {imageFit
					? 'object-contain'
					: 'object-cover'}"
				style="transform: translate({translateX}px, {translateY}px) scale({scale});"
			/>

			<p class="text-orange text-xl absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center z-[4]">
				Loading...
			</p>
		{:else}
			<!-- Description view -->
			<div class="h-full w-full overflow-auto p-5">
				<p class="text-black text-lg text-justify">
					{@html formatSellerDescription(description.text)}
				</p>
				{#if description.vendorURL && description.vendorURL !== "N/A"}
					<a
						href={(() => {
							try {
								const url = new URL(description.vendorURL);
								url.search = ""; // Clear existing query parameters
								url.searchParams.set("utm_source", "autoguessr");
								url.searchParams.set("utm_medium", "referral");
								return url.toString();
							} catch (error) {
								console.warn("Error constructing vendor URL:", error);
							}
						})()}
						target="_blank"
						rel="noopener noreferrer"
						class="text-lg underline"
					>
						Visit the seller's website
					</a>
				{/if}
				{#if description.coordinates}
					<div class="rounded-lg overflow-clip mt-5">
						<MapDisplay coordinates={description.coordinates} />
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
