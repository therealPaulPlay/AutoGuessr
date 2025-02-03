<script>
	import { formatSellerDescription } from "$lib/utils/formatDescription";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { currentCarouselIndex } from "$lib/stores/gameStore";
	import MapDisplay from "./MapDisplay.svelte";
	import { Howl } from "howler";

	let { images = [], description = "No desciption was provided.", descriptionFlag = false, children } = $props();

	let imgElement = $state();
	let zoomResult = $state();
	let showZoom = $state(false);
	let isLoading = $state(true);

	function next() {
		if (images.length > 1) isLoading = true;
		if (imgElement && images.length > 1) imgElement.src = ""; // Clear the current image (if more than one image - otherwise the current will be cleared)
		$currentCarouselIndex = ($currentCarouselIndex + 1) % images.length;
		new Howl({ src: ["/sounds/short_click.webm"] }).play();
	}

	function prev() {
		if (images.length > 1) isLoading = true;
		if (imgElement && images.length > 1) imgElement.src = ""; // Clear the current image
		$currentCarouselIndex = ($currentCarouselIndex - 1 + images.length) % images.length;
		new Howl({ src: ["/sounds/short_click.webm"] }).play();
	}

	onMount(() => {
		imgElement.src = "";
	});

	function imageZoom() {
		// Wait for the image to load to get accurate dimensions
		imgElement.onload = () => {
			updateZoomDimensions();
		};

		imgElement.addEventListener("mousemove", updateZoom);
		imgElement.addEventListener("mouseleave", () => {
			zoomResult.style.backgroundPosition = "center";
		});

		function updateZoomDimensions() {
			const rect = imgElement.getBoundingClientRect();
			zoomResult.style.backgroundImage = `url(${imgElement.src})`;
			zoomResult.style.backgroundSize = rect.width * 2 + "px " + rect.height * 2 + "px";
		}

		function updateZoom(e) {
			const rect = imgElement.getBoundingClientRect();
			const pos = getCursorPos(e, rect);
			console.log(pos);

			// Calculate the percentage position of the cursor on the image
			const xPercent = (pos.x / rect.width) * 100;
			const yPercent = (pos.y / rect.height) * 100;

			// Set the background position of the zoomResult
			zoomResult.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
		}

		function getCursorPos(e, rect) {
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			return { x, y };
		}
	}

	let imageFit = $state(false);

	$effect(() => {
		if (imgElement && showZoom) {
			imageZoom();
		}
	});
</script>

<div class="flex w-full h-full relative rounded-2xl border-white border-8 bg-white overflow-hidden">
	<div class="relative w-full h-full flex items-center bg-tanLight rounded-lg min-h-96">
		{#if !descriptionFlag}
			<div class="z-20 w-full h-full flex flex-row justify-between items-center mx-4 pointer-events-none">
				<div class="realtive w-16 h-16 flex justify-center bg-white rounded-full pr-2 pointer-events-auto">
					<button onclick={prev} class="z-20 transition active:scale-90">
						<img src="/assets/svg/arrow.svg" alt="Previous" class="w-8" />
					</button>
				</div>
				<div class="realtive w-16 h-16 flex justify-center bg-white rounded-full pl-2 pointer-events-auto">
					<button onclick={next} class="z-20 transition active:scale-90">
						<img src="/assets/svg/arrow.svg" alt="Next" class="w-8 scale-x-[-1]" />
					</button>
				</div>
			</div>
			<!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<img
				src={images[$currentCarouselIndex]}
				alt=" "
				bind:this={imgElement}
				onload={() => (isLoading = false)}
				onclick={() => {
					imageFit = !imageFit;
				}}
				onmouseover={() => {
					showZoom = true;
				}}
				onfocus={() => {
					showZoom = true;
				}}
				tabindex="0"
				role="button"
				class="absolute h-full w-full {imageFit
					? 'object-contain'
					: 'object-cover'} z-10 cursor-crosshair rounded-lg transition ease-in-out {isLoading ? 'opacity-0' : ''}"
			/>
			<p
				class="text-orange text-xl absolute top-0 bottom-0 left-0 right-0 text-center text-wrap flex flex-wrap justify-center items-center bg-white z-[9]"
			>
				Loading...
			</p>
			{#if showZoom}
				<div
					transition:fade={{ duration: 150 }}
					bind:this={zoomResult}
					class="absolute m-5 w-32 h-32 z-10 rounded-lg top-0 right-0"
				></div>
			{/if}
		{:else}
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
