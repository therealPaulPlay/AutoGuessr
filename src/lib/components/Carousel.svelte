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
</script>

<div
    class="flex w-full h-[60vh] relative overflow-clip rounded-2xl border-white border-8"
>
    {#if !descriptionFlag}
        <img
            src={images[currentIndex]}
            alt="Carousel"
            class="absolute h-full w-full object-cover z-10"
        />
    {/if}
    <div
        class="relative w-full h-full overflow-hidden flex justify-between items-center gap-4 p-4 bg-white"
    >
        {#if !descriptionFlag}
            <div
                class="z-20 w-full h-full flex flex-row justify-between items-center"
            >
                <div
                    class="realtive w-16 h-16 flex justify-center bg-white rounded-full pr-2"
                >
                    <button onclick={prev} class="z-20">
                        <img
                            src="/assets/svg/arrow.svg"
                            alt="Previous"
                            class="w-8"
                        />
                    </button>
                </div>
                <div
                    class="realtive w-16 h-16 flex justify-center bg-white rounded-full pl-2"
                >
                    <button onclick={next} class="z-20">
                        <img
                            src="/assets/svg/arrow.svg"
                            alt="Next"
                            class="w-8 scale-x-[-1]"
                        />
                    </button>
                </div>
            </div>
        {:else}
            <div class="w-full h-full flex flex-col overflow-auto p-5">
                <h1 class="font-bold text-2xl mb-2">
                    Here is what the seller has to say:
                    <!-- Maybe we can make this dynamically change between different sentences? To make it feel fresh -->
                </h1>
                <p class="text-black text-lg">{description}</p>
            </div>
        {/if}
    </div>
</div>