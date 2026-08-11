<script>
	import { onMount } from "svelte";
	import { currentCarouselIndex } from "$lib/stores/gameStore";
	import { Howl } from "howler";
	import { formatSellerDescription } from "$lib/utils/formatDescription";
	import MapDisplay from "./MapDisplay.svelte";
	let { images, description = null, descriptionFlag = false } = $props();

	// Upgrade http (blocked as mixed content), and add www. on auto.dev to skip an 80ms redirect
	const processedImages = $derived(
		(images ?? []).map((url) =>
			url.replace(/^http:/, "https:").replace(/^https:\/\/auto\.dev\//, "https://www.auto.dev/"),
		),
	);
	const currentImage = $derived(processedImages[$currentCarouselIndex]);

	// References and state
	let container; // The main container for sizing
	let imgEl = $state();
	let loadState = $state("loading"); // "loading" | "loaded" | "error"
	let imageFit = $state(false); // Toggles object-fit between cover and contain

	// Reset per image, checking completeness because a cached image fires no load event
	$effect(() => {
		if (!currentImage) loadState = images ? "error" : "loading";
		else if (imgEl?.complete && imgEl.currentSrc) loadState = imgEl.naturalWidth > 0 ? "loaded" : "error";
		else loadState = "loading";
	});

	// Preload the next image so navigating feels instant
	$effect(() => {
		const next = processedImages[$currentCarouselIndex + 1];
		if (next) new Image().src = next;
	});

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

	// Zooming via mouse wheel
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

	// Navigate Carousel
	function step(direction) {
		if (processedImages.length <= 1) return;
		$currentCarouselIndex = ($currentCarouselIndex + direction + processedImages.length) % processedImages.length;
		new Howl({ src: ["/sounds/short_click.webm"] }).play();
		resetZoom();
	}
	const next = () => step(1);
	const prev = () => step(-1);

	// Swipe Handling for Mobile
	let touchStartX = 0;
	let touchStartY = 0;
	let touchEndX = 0;
	let touchEndY = 0;

	function handleTouchStart(event) {
		if (event.touches.length > 1) return;
		touchStartX = event.touches[0].clientX;
		touchStartY = event.touches[0].clientY;
		touchEndX = touchStartX;
		touchEndY = touchStartY;
	}
	function handleTouchMove(event) {
		if (event.touches.length > 1) return;
		event.preventDefault();
		touchEndX = event.touches[0].clientX;
		touchEndY = event.touches[0].clientY;
	}
	function handleTouchEnd() {
		const dx = touchEndX - touchStartX;
		const dy = touchEndY - touchStartY;
		if (Math.abs(dx) > 50 && Math.abs(dy) < 50) {
			dx < 0 ? next() : prev();
		}
	}

	onMount(() => {
		updateContainerSize();
	});
</script>

<svelte:window onresize={updateContainerSize} />

<div
	bind:this={container}
	role="region"
	aria-label="Image carousel"
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
	class="flex w-full h-full relative rounded-2xl border-white border-[10px] bg-white overflow-hidden"
>
	<div class="relative w-full h-full flex items-center rounded-lg min-h-96">
		{#if !descriptionFlag}
			<div class="hidden sm:flex z-10 w-full h-full flex-row justify-between items-center mx-4 pointer-events-none">
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
			<div class="absolute -bottom-1.5 -right-[5px] p-2 bg-white rounded-tl-lg font-medium text-base text-orange z-10">
				<p class="text-lg">
					{processedImages.length ? $currentCarouselIndex + 1 : 0} / {processedImages.length}
				</p>
			</div>

			<!-- Updated the image src to use the processedImages array -->
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<img
				src={currentImage}
				bind:this={imgEl}
				onload={() => {
					loadState = "loaded";
					resetZoom();
					updateContainerSize();
				}}
				onerror={() => (loadState = "error")}
				onclick={() => {
					imageFit = !imageFit;
				}}
				onwheel={handleWheel}
				tabindex="0"
				alt=" "
				role="button"
				class="absolute h-full w-full z-[5] cursor-crosshair rounded-lg transition ease-in-out {imageFit
					? 'object-contain'
					: 'object-cover'}"
				class:opacity-0={loadState !== "loaded"}
				style="transform: translate({translateX}px, {translateY}px) scale({scale});"
			/>

			{#if loadState !== "loaded"}
				<p class="text-orange text-xl absolute inset-0 flex justify-center items-center z-[6] pointer-events-none">
					{loadState === "error" ? "Failed to load." : "Loading..."}
				</p>
			{/if}
		{:else}
			<!-- Description view -->
			<div class="h-full w-full overflow-auto p-5">
				<div class="text-black text-lg text-justify">
					{@html formatSellerDescription(description?.text)}
				</div>
				{#if description?.vendorURL && description.vendorURL !== "N/A"}
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
				{#if description?.coordinates}
					<div class="rounded-lg overflow-clip mt-5">
						<MapDisplay coordinates={description.coordinates} />
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
