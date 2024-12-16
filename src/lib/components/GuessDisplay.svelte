<script>
    import { onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
    import { fly } from "svelte/transition";
    gsap.registerPlugin(ScrollToPlugin);

    let { answer, guess, percentageDifference } = $props();

    let sectionsAmount = 50;

    let showAnswerPrice = $state(false);
    let showGuessPrice = $state(false);
    let answerPos = $state(0);
    let guessPos = $state(0);
    let answerBarPos = $state(0);
    let guessBarPos = $state(0);

    function scrollToAnswer() {
        showGuessPrice = false;
        // gsap scroll to
        gsap.to(guessBand, {
            duration: 2,
            scrollTo: {
                x: answerBar,
                offsetX: getMarkingsVisibleWidth() / 2 - 7,
            },
            ease: "expo.inOut",
            onComplete: () => {
                showAnswerPrice = true;
                // For some reason, this is what I had to do to have it positioned correctly.
                setTimeout(() => {
                    positionAnswerPrice();
                }, 50);
            },
        });
    }

    let guessBand = $state();

    let answerBar = $state();
    let guessBar = $state();

    let answerPrice = $state();
    let guessPrice = $state();

    function positionAnswerPrice() {
        answerPos = positionPrice(answerBar, answerPrice);
    }

    function positionGuessPrice() {
        guessPos = positionPrice(guessBar, guessPrice);
    }

    function positionPrice(barElement, priceElement) {
        if (typeof window === "undefined" && !barElement) return;

        let barOffset = barElement.getBoundingClientRect().left;
        let priceWidth = priceElement.getBoundingClientRect().width;
        let barWidth = barElement.getBoundingClientRect().width;
        let mainWrapperOffset = getMainWrapperOffset();

        let position =
            barOffset - mainWrapperOffset - priceWidth / 2 + barWidth / 2;

        return position;
    }

    function positionGuessBar() {
        // Positions the guess bar randomly on the left or right half depending on the guess.
        const markingsVisibleWidth = getMarkingsVisibleWidth();
        const barScrollWidth = getBarScrollWidth();

        if (guess < answer) {
            guessBarPos = Math.floor(
                Math.random() * (markingsVisibleWidth / 2),
            );
        } else {
            guessBarPos =
                barScrollWidth -
                Math.floor(Math.random() * (markingsVisibleWidth / 2));
        }
    }

    function positionAnswerBar() {
        const scrollWidth = getBarScrollWidth();

        let difference = percentageDifference > 90 ? 90 : percentageDifference;
        let offset = scrollWidth * (difference / 100);

        if (guess < answer) {
            answerBarPos = offset;
        } else {
            answerBarPos = scrollWidth - offset;
        }
    }

    function getBarScrollWidth() {
        return guessBand.scrollWidth;
    }

    function getMainWrapperOffset() {
        const mainWrapper = document.getElementById("wrapper");
        return mainWrapper.getBoundingClientRect().left;
    }

    function getMarkingsVisibleWidth() {
        return document.querySelector(".markings").clientWidth;
    }

    onMount(() => {
        positionGuessBar();
        setTimeout(() => {
            showGuessPrice = true;
            setTimeout(() => {
                positionGuessPrice();
            }, 50);
        }, 250);
    });

    onMount(() => {
        positionAnswerBar();
        setTimeout(() => {
            scrollToAnswer();
        }, 2000);
    });

    onMount(() => {
        // Starts at the end if the guess is more than the answer. (aka left of the answer)
        if (guess > answer) {
            guessBand.scrollTo({
                left: guessBand.scrollWidth,
                behavior: "auto",
            });
        }
    });
</script>

<div class="w-full h-full relative" id="wrapper">
    <div
        class="relative w-full h-full overflow-x-scroll overflow-y-auto guess-band remove-scrollbar pointer-events-none" bind:this={guessBand}>
        <div
            class="absolute z-10 flex bottom-0 justify-center w-3.5 h-full bg-orange"
            style:left="{answerBarPos}px"
            bind:this={answerBar}>
        </div>
        <div
            class="absolute z-10 flex bottom-0 justify-center w-3.5 h-full bg-black"
            style:left="{guessBarPos}px"
            bind:this={guessBar}>
        </div>
        <!-- Lines -->
        <div class="flex w-full h-full items-end gap-3 rounded-lg markings">
            {#each { length: 10 * sectionsAmount } as _, i}
                <div class="line"></div>
            {/each}
        </div>
    </div>

    {#if showAnswerPrice}
        <div
            transition:fly={{ y: -10, delay: 50 }}
            class="absolute flex items-center flex-col -top-12"
            style:left="{answerPos}px"
            bind:this={answerPrice}>
            <div class="text-orange font-semibold text-base">
                ${answer.toLocaleString()}
            </div>
            <img
                src="/assets/svg/simple arrow.svg"
                alt="Arrow"
                class="w-3.5 h-3.5 -rotate-90" />
        </div>
    {/if}
    {#if showGuessPrice}
        <div
            transition:fly={{ y: -10, delay: 50 }}
            class="absolute flex items-center flex-col -top-12"
            style:left="{guessPos}px"
            bind:this={guessPrice}>
            <div class="text-black font-semibold text-base">
                ${guess.toLocaleString()}
            </div>
            <img
                src="/assets/svg/simple arrow black.svg"
                alt="Arrow"
                class="w-3.5 h-3.5 -rotate-90" />
        </div>
    {/if}
</div>

<style>
    .line {
        height: 30%;
        opacity: 0.4;
        flex-shrink: 0;
        border-radius: 9999px;
        width: 4px;
        background-color: var(--black);
    }

    .remove-scrollbar {
        scrollbar-width: none; /* Hide scrollbar for Firefox */
    }
</style>
