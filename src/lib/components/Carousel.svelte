<script>
    let {
        images = [],
        description = null,
        descriptionFlag = false,
        children,
    } = $props();

    let currentIndex = $state(0);

    function next() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function prev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }

    let imageFit = $state(false);
</script>

<div
    class="flex w-full h-[60vh] relative rounded-2xl border-white border-8 bg-white"
>
    {#if !descriptionFlag}
        <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <img
            src={images[currentIndex]}
            alt="Loading images..."
            onclick={() => {
                imageFit = !imageFit;
            }}
            tabindex="0"
            role="button"
            class="absolute h-full w-full {imageFit ? "object-contain" : "object-cover"} z-10 bg-white cursor-pointer rounded-lg"
        />
    {/if}
    <div
        class="relative w-full h-full overflow-hidden flex justify-between items-center bg-tanLight rounded-lg"
    >
        {#if !descriptionFlag}
            <div
                class="z-20 w-full h-full flex flex-row justify-between items-center mx-4 pointer-events-none"
            >
                <div
                    class="realtive w-16 h-16 flex justify-center bg-white rounded-full pr-2 pointer-events-auto"
                >
                    <button onclick={prev} class="z-20 transition active:scale-90">
                        <img
                            src="/assets/svg/arrow.svg"
                            alt="Previous"
                            class="w-8"
                        />
                    </button>
                </div>
                <div
                    class="realtive w-16 h-16 flex justify-center bg-white rounded-full pl-2 pointer-events-auto"
                >
                    <button onclick={next} class="z-20 transition active:scale-90">
                        <img
                            src="/assets/svg/arrow.svg"
                            alt="Next"
                            class="w-8 scale-x-[-1]"
                        />
                    </button>
                </div>
            </div>
        {:else}
            <div class="absolute h-full flex flex-col overflow-auto p-10">
                <h1 class="font-bold text-2xl mb-7">
                    Here is what the seller has to say:
                    <!-- Maybe we can make this dynamically change between different sentences? To make it feel fresh -->
                </h1>
                <p class="text-black text-lg text-justify">{description}</p>
            </div>
        {/if}
    </div>
</div>