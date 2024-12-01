<script>
    import { onMount } from "svelte";
    import Button from "../../lib/components/Button.svelte";
    import CardBack from "../../lib/components/CardBack.svelte";

    let rarities = [
        "common",
        "rare",
        "epic",
        "legendary",
        "mystical",
        "rare",
        "epic",
        "common",
        "legendary",
        "mystical",
        "legendary",
        "mystical",
        "rare",
    ];
    let minSize = 15;

    let windowWidth = $state();
    let middlePoint = $derived(windowWidth / 2);

    // let w = $state();

    function scrollToEnd() {
        const container = document.querySelector(".scroll-container");
        container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    }

    function controlSize(node) {
        $effect(()=> {
            let position = $state(node.getBoundingClientRect().left);
            let width = $state(node.getBoundingClientRect().width);

            let size = $derived.by(() => {
                let cardMiddle = position + width / 2;
                // let a = 5;  // a>0, used to control the curve "drop off rate"
                // let b = 1.5;  // b>0, used to control the curve "height"

                let distance = Math.abs(middlePoint - cardMiddle);
                // let size = -a * Math.pow(distance, 2) + b;
                let size = minSize + (1 / distance) * 1000;
                console.log(size);
                return size;
            });

            node.style.height = `${size}rem`;
            })
        }
</script>

<svelte:window bind:innerWidth={windowWidth} />
<main class="relative">
    <div class="flex flex-col w-full justify-center items-center">
        <div>
            <img
                src="/assets/svg/arrow.svg"
                alt="Arrow"
                class="w-8 h-8 -rotate-90"
            />
        </div>
        <div
            class="my-5 min-h-96 flex flex-row items-center w-full overflow-x-auto overflow-y-hidden scroll-container"
        >
            {#each rarities as rarity, i}
                <div
                    use:controlSize
                    class="flex-shrink-0 z-10 transition-all ease-in-out delay-15"
                    style:height="15rem"
                >
                    <CardBack {rarity} />
                </div>
            {/each}
        </div>
        <div>
            <img
                src="/assets/svg/arrow.svg"
                alt="Arrow"
                class="w-8 h-8 rotate-90 scale-y-[-1]"
            />
        </div>
        <div class="mt-5">
            <Button
                buttonHeight="4rem"
                buttonWidth="12rem"
                shadowHeight="0.5rem"
                execFunction={scrollToEnd}
            >
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
