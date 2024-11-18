<script>
    let { 
        images=[],
        description=null,
        descriptionFlag=false,
        children
     } = $props();

    let currentIndex = $state(0);


    function next() {
        currentIndex = (currentIndex + 1) % images.length;
    }

    function prev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }
</script>

<div class="flex w-full h-[60vh] relative overflow-clip rounded-2xl border-white border-8">
    {#if !descriptionFlag}
        <img src={images[currentIndex]} alt="Carousel" class=" h-full w-full object-cover z-10"/>
    {/if}
    <div class="absolute w-full h-full overflow-hidden flex justify-between items-center gap-4 p-4 bg-white">
        {#if !descriptionFlag}
            <button onclick={prev} class="z-20">
                <img src="/assets/svg/arrow.svg" alt="Previous" class="w-8"/>
            </button>
            <button onclick={next} class="z-20">
                <img src="/assets/svg/arrow.svg" alt="Next" class="w-8 scale-x-[-1]"/>
            </button>
        {:else}
            <div class="w-full h-full flex overflow-auto">
                <p class="text-black text-lg">{description}</p>
            </div>
        {/if}
    </div>
</div>