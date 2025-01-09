<script>
    import { formatSellerDescription } from "$lib/utils/formatDescription";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { currentCarouselIndex } from "$lib/stores/gameStore";

    let {
        images = [],
        description = "No desciption was provided.",
        descriptionFlag = false,
        children,
    } = $props();

    let imgElement = $state();
    let zoomResult = $state();
    let showZoom = $state(false);

    function next() {
        $currentCarouselIndex = ($currentCarouselIndex + 1) % images.length;
    }

    function prev() {
        $currentCarouselIndex =
            ($currentCarouselIndex - 1 + images.length) % images.length;
    }

    function imageZoom() {
        var img = imgElement;
        var result = zoomResult;

        // Set the zoomResult's background to show the image
        result.style.backgroundImage = `url(${img.src})`;
        result.style.backgroundSize =
            img.width * 2 + "px " + img.height * 2 + "px";

        img.addEventListener("mousemove", updateZoom);
        img.addEventListener("mouseleave", () => {
            showZoom = false;
        });

        function updateZoom(e) {
            /* Get the cursor's position relative to the image */
            var pos = getCursorPos(e);

            /* Calculate the percentage position of the cursor on the image */
            var xPercent = (pos.x / img.width) * 100;
            var yPercent = (pos.y / img.height) * 100;

            /* Set the background position of the zoomResult */
            result.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
        }

        function getCursorPos(e) {
            var a,
                x = 0,
                y = 0;
            e = e || window.event;
            a = img.getBoundingClientRect();
            x = e.pageX - a.left - window.pageXOffset;
            y = e.pageY - a.top - window.pageYOffset;
            return { x: x, y: y };
        }
    }

    let imageFit = $state(false);

    $effect(() => {
        if (imgElement && showZoom) {
            imageZoom();
        }
    });
</script>

<div
    class="flex w-full h-[60vh] relative rounded-2xl border-white border-8 bg-white">
    {#if !descriptionFlag}
        <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            src={images[$currentCarouselIndex]}
            alt=" "
            bind:this={imgElement}
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
                : 'object-cover'} z-10 cursor-crosshair rounded-lg" />
        <p
            class="text-orange text-xl absolute top-0 bottom-0 left-0 right-0 text-center text-wrap flex flex-wrap justify-center items-center bg-white z-[9]">
            Loading...
        </p>
        {#if showZoom}
            <div
                transition:fade={{ duration: 150 }}
                bind:this={zoomResult}
                class="absolute m-5 w-32 h-32 z-10 rounded-lg right-0">
            </div>
        {/if}
    {/if}
    <div
        class="relative w-full h-full overflow-hidden flex justify-between items-center bg-tanLight rounded-lg">
        {#if !descriptionFlag}
            <div
                class="z-20 w-full h-full flex flex-row justify-between items-center mx-4 pointer-events-none">
                <div
                    class="realtive w-16 h-16 flex justify-center bg-white rounded-full pr-2 pointer-events-auto">
                    <button
                        onclick={prev}
                        class="z-20 transition active:scale-90">
                        <img
                            src="/assets/svg/arrow.svg"
                            alt="Previous"
                            class="w-8" />
                    </button>
                </div>
                <div
                    class="realtive w-16 h-16 flex justify-center bg-white rounded-full pl-2 pointer-events-auto">
                    <button
                        onclick={next}
                        class="z-20 transition active:scale-90">
                        <img
                            src="/assets/svg/arrow.svg"
                            alt="Next"
                            class="w-8 scale-x-[-1]" />
                    </button>
                </div>
            </div>
        {:else}
            <div class="absolute h-full flex flex-col overflow-auto p-10">
                <h1 class="font-bold text-2xl mb-7">Seller's description:</h1>
                <p class="text-black text-lg text-justify">
                    {@html formatSellerDescription(description)}
                </p>
            </div>
        {/if}
    </div>
</div>
