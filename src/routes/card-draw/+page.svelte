<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import Button from "../../lib/components/Button.svelte";
    import CardBack from "../../lib/components/CardBack.svelte";

    let rarities = [
        "common", "epic", "rare", "mystical", "legendary", 
        "epic", "common", "legendary", "rare", "mystical", 
        "rare", "epic", "common", "mystical", "epic", 
        "legendary", "rare", "epic", "common", "mystical", 
        "legendary", "common", "epic", "rare", "legendary", 
        "rare", "common", "mystical", "epic", "legendary",
        "common", "epic", "rare", "mystical", "legendary", 
        "epic", "common", "legendary", "rare", "mystical", 
        "rare", "epic", "common", "mystical", "epic", 
        "legendary", "rare", "epic", "common", "mystical", 
        "legendary", "common", "epic", "rare", "legendary", 
        "rare", "common", "mystical", "epic", "legendary"
    ];

    let cardWidth = $state();
    let containerWidth = $state();
    let windowWidth = $state();

    function scrollToEnd() {
        let cardsOnRight = 1;
        const container = document.querySelector(".scroll-container");

        // 1. Scroll the container all the way to the left (the right side of the container is on the left side of the screen)
        // 2. Move the container to the right by the half width of the screen
        // 3. Move the container to the right by the half width of the card
        // 4. For any addtional cards on the right, move the container to the right by the width of the card and add 8px for the gap (gap-2 in Tailwindcss)
        gsap.to(container, { x: -(container.scrollWidth - windowWidth/2 - cardWidth/2 - (cardsOnRight * (cardWidth + 8))), duration: 4, ease: "power2.inOut"});
    }

</script>
<!-- window size -->
<svelte:window bind:innerWidth={windowWidth} />
<main class="relative">
    <div class="flex flex-col w-full justify-center items-center">
        <div>
            <img
                src="/assets/svg/arrow.svg"
                alt="Arrow"
                class="w-8 h-8 -rotate-90" />
        </div>
        <div
            bind:clientWidth={containerWidth}
            class="min-h-96 flex flex-row items-center w-fit scroll-container gap-2 ">
            {#each rarities as rarity, i}
                <div
                    bind:clientWidth={cardWidth}
                    class="flex-shrink-0 z-10 transition-all ease-in-out delay-300 cards"
                    style:height="22rem"
                    id="card_{i}">
                    <CardBack {rarity} />
                </div>
            {/each}
        </div>
        <div>
            <img
                src="/assets/svg/arrow.svg"
                alt="Arrow"
                class="w-8 h-8 rotate-90 scale-y-[-1]" />
        </div>
        <div class="mt-5">
            <Button
                buttonHeight="4rem"
                buttonWidth="12rem"
                shadowHeight="0.5rem"
                execFunction={scrollToEnd}>
                <span class="text-white font-bold text-4xl">Roll!</span>
            </Button>
        </div>
    </div>
</main>

<style>
    .scroll-container {
        scrollbar-width: none; /* Hide scrollbar for Firefox */
    }

    .scroll-container::-webkit-scrollbar {
        display: none; /* Hide scrollbar for WebKit browsers */
    }
</style>
