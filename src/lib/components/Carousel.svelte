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
    class="flex w-full h-[60vh] relative overflow-clip rounded-2xl border-white border-8 bg-white"
>
    {#if !descriptionFlag}
        <img
            src={images[currentIndex]}
            alt="Carousel"
            class="absolute h-full w-full object-cover z-10 bg-white"
        />
    {/if}
    <div
        class="relative w-full h-full overflow-hidden flex justify-between items-center bg-tanLight"
    >
        {#if !descriptionFlag}
            <div
                class="z-20 w-full h-full flex flex-row justify-between items-center mx-2"
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