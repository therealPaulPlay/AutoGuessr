<script>
    import { onMount } from "svelte";
    import { tick } from "svelte";
    import { fade } from "svelte/transition";
    import { gsap } from "gsap";
    import Button from "../../lib/components/Button.svelte";
    import CardBack from "../../lib/components/CardBack.svelte";
    import Card from "../../lib/components/Card.svelte";
    import Flip from "gsap/dist/Flip";
    gsap.registerPlugin(Flip);

    let cardInfo = {
        name: "TestName 1",
        HP: 400,
        price: 45000,
        etype: "V10",
        date: "2024",
        rarity: "mystical",
        image: "/assets/img/example/cardcar.png",
    };

    let cardWidth = $state();
    let containerWidth = $state();
    let windowWidth = $state();
    let raritiesSize = 40;
    let rarities = [];
    let showRevealButton = $state(false);
    let showCardBack = $state(false);
    let cardsOnRight = 3; // For some reason 0 breaks it. Not sure why
    let cardPositionIndex = raritiesSize - 1 - cardsOnRight;

    for (let i = 0; i < raritiesSize; i++) {
        let number = Math.floor(Math.random() * 100);
        switch (true) {
            case i === cardPositionIndex:
                rarities.push(cardInfo.rarity);
                break;
            case number <= 50:
                rarities.push("common");
                break;
            case number <= 70:
                rarities.push("rare");
                break;
            case number <= 90:
                rarities.push("epic");
                break;
            case number <= 98:
                rarities.push("legendary");
                break;
            default:
                rarities.push("mystical");
                break;
        }
    }

    function scrollToEnd() {
        const container = document.querySelector(".scroll-container");

        // 1. Scroll the container all the way to the left (the right side of the container is on the left side of the screen)
        // 2. Move the container to the right by the half width of the screen
        // 3. Move the container to the right by the half width of the card
        // 4. For any addtional cards on the right, move the container to the right by the width of the card and add 8px for the gap (gap-2 in Tailwindcss)
        gsap.to(container, {
            x: -(
                container.scrollWidth -
                windowWidth / 2 -
                cardWidth / 2 -
                cardsOnRight * (cardWidth + 8)
            ),
            duration: 4,
            ease: "power2.inOut",
        }).then(() => {
            showRevealButton = true;
            buttonAnimation();
        });
    }

    function revealCard() {
        showCardBack = !showCardBack;
    }

    function initialCenterCards() {
        const container = document.querySelector(".scroll-container");
        gsap.to(container, {
            x: windowWidth / 2 - cardWidth / 2,
            duration: 0.5,
            ease: "power2.inOut",
        });
    }

    async function buttonAnimation() {
        const revealBtnState = Flip.getState(".btn");

        await tick();

        Flip.from(revealBtnState, {
            duration: 0.3,
            ease: "power1.inOut",
        });
    }

    onMount(() => {
        initialCenterCards();
    });

    let resizeTimeout;
</script>

<!-- window size -->
<svelte:window
    bind:innerWidth={windowWidth}
    onresize={() => {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(() => {
            initialCenterCards();
        }, 100);
    }}
/>
<content class="relative h-full block">
    <div
        class="flex flex-col w-full justify-center items-center custom-card-container-height"
    >
        <div>
            <img
                src="/assets/svg/arrow.svg"
                alt="Arrow"
                class="w-8 h-8 -rotate-90"
            />
        </div>
        <div
            bind:clientWidth={containerWidth}
            class="min-h-96 flex flex-row items-center w-fit scroll-container gap-2 my-5"
        >
            {#each rarities as rarity, i}
                {#if i === cardPositionIndex}
                    <div
                        bind:clientWidth={cardWidth}
                        class="flex-shrink-0 z-10 transition-all duration-700 w-fit relative [transform-style:preserve-3d]"
                        class:flip-it={showCardBack}
                        style:height="24rem"
                        style:width="{cardWidth}px"
                        id="card_{i}"
                    >
                        <div
                            class="absolute w-full h-full [backface-visibility:hidden]"
                        >
                            <CardBack {rarity} />
                        </div>
                        <div
                            class="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
                        >
                            <Card {...cardInfo} />
                        </div>
                    </div>
                {:else}
                    <div
                        bind:clientWidth={cardWidth}
                        class="flex-shrink-0 z-10 transition-all ease-in-out delay-300"
                        style:height="24rem"
                        id="card_{i}"
                    >
                        <CardBack {rarity} />
                    </div>
                {/if}
            {/each}
        </div>
        <div>
            <img
                src="/assets/svg/arrow.svg"
                alt="Arrow"
                class="w-8 h-8 rotate-90 scale-y-[-1]"
            />
        </div>
        <div class="mt-5 flex flex-row gap-5 btn">
            <div class="min-w-[12rem]">
                <Button
                    buttonHeight="4rem"
                    buttonWidth="12rem"
                    shadowHeight="0.5rem"
                    execFunction={scrollToEnd}
                >
                    <span class="text-white font-bold text-4xl">Roll!</span>
                </Button>
            </div>
            {#if showRevealButton}
                <div transition:fade>
                    <Button
                        buttonHeight="4rem"
                        buttonWidth="12rem"
                        shadowHeight="0.5rem"
                        color="var(--green-button)"
                        bgcolor="var(--green-button-dark)"
                        execFunction={revealCard}
                    >
                        <span class="text-white font-bold text-4xl"
                            >Reveal!</span
                        >
                    </Button>
                </div>
            {/if}
        </div>
    </div>
    <div class="absolute w-full h-full top-0 left-0 -z-50">
        <img
            src="/assets/svg/question mark.svg"
            alt="Background question mark"
            class="absolute h-52 bottom-0 rotate-12"
        />
        <img
            src="/assets/svg/question mark.svg"
            alt="Background question mark"
            class="absolute h-36 bottom-0 left-36 rotate-45"
        />
        <img
            src="/assets/svg/question mark.svg"
            alt="Background question mark"
            class="absolute h-36 -top-32 left-72 -rotate-12 scale-y-[-1] scale-x-[-1]"
        />
        <img
            src="/assets/svg/question mark.svg"
            alt="Background question mark"
            class="absolute h-24 -top-32 left-56 scale-y-[-1] scale-x-[-1]"
        />
        <img
            src="/assets/svg/question mark.svg"
            alt="Background question mark"
            class="absolute h-28 bottom-0 right-8 -rotate-12"
        />
    </div>
</content>

<style>
    .scroll-container {
        scrollbar-width: none; /* Hide scrollbar for Firefox */
    }

    .scroll-container::-webkit-scrollbar {
        display: none; /* Hide scrollbar for WebKit browsers */
    }

    .custom-card-container-height {
        height: calc(100% - 180px);
    }

    .flip-it {
        transform: rotateY(180deg);
    }
</style>
