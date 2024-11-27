<script>
    import { onMount } from "svelte";
    import Card from "../../lib/components/Card.svelte";

    let cards = [
    {
        "name": "TestName 1",
        "HP": 400,
        "price": 45000,
        "etype": "V10",
        "date": "2024",
        "rarity": "epic",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "TestName 2",
        "HP": 500,
        "price": 50000,
        "etype": "V12",
        "date": "2024",
        "rarity": "legendary",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "TestName 3",
        "HP": 350,
        "price": 40000,
        "etype": "V8",
        "date": "2024",
        "rarity": "rare",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "TestName 4",
        "HP": 300,
        "price": 37500,
        "etype": "V8",
        "date": "2024",
        "rarity": "mystical",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "TestName 5",
        "HP": 320,
        "price": 36000,
        "etype": "V8 Turbo",
        "date": "2023",
        "rarity": "rare",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "TestName 6",
        "HP": 450,
        "price": 47000,
        "etype": "V10 Turbo",
        "date": "2023",
        "rarity": "epic",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "TestName 7",
        "HP": 200,
        "price": 25000,
        "etype": "V6",
        "date": "2024",
        "rarity": "common",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "TestName 8",
        "HP": 310,
        "price": 34000,
        "etype": "V8",
        "date": "2022",
        "rarity": "rare",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "TestName 9",
        "HP": 600,
        "price": 55000,
        "etype": "V12",
        "date": "2024",
        "rarity": "legendary",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "TestName 10",
        "HP": 380,
        "price": 42000,
        "etype": "V8",
        "date": "2023",
        "rarity": "epic",
        "image": "/assets/img/example/cardcar.png"
    }
    ];

    // THESE ARE INDEX VALUES
    let selectedCard = $state(0);

    function incrementSelectedCard() {
        selectedCard >= cards.length - 1 ? selectedCard = cards.length - 1 : selectedCard++;
    }

    function decrementSelectedCard() {
        selectedCard <= 0 ? selectedCard = 0 : selectedCard--;
    }

    function scrollRight() {
        incrementSelectedCard();
        centerCard();
    }

    function scrollLeft() {
        decrementSelectedCard();
        centerCard();
    }

    let windowWidth = $state();
    let windowHeight = $state();

    let minCardWidth = $derived(0.2 * windowHeight);
    let midCardWidth = $derived(0.3 * windowHeight);
    let maxCardWidth = $derived(0.5 * windowHeight);


    function centerCard() {

        const card = document.getElementById(`card_${selectedCard}`);
        cards.forEach((c, i) => {
            if (i === selectedCard - 1 || i === selectedCard + 1) {
                document.getElementById(`card_${i}`).style.minWidth = `${midCardWidth}px`;
            }
            else if (i !== selectedCard ) {
                document.getElementById(`card_${i}`).style.minWidth = `${minCardWidth}px`;
            }
        });
        card.style.minWidth = maxCardWidth + `px`;

        // Wait for the transition to end before centering a card.
        // Not doing this will cause the card to be centered incorrectly before the transition ends due to how sizes are calculated.
        // TODO: Figure a way to do this without using a timeout.
        card.addEventListener('transitionend', handleTransitionEnd, { once: true });
    }

    function handleTransitionEnd() {
        const card = document.getElementById(`card_${selectedCard}`);
        // Centers the container on the selected card.
        const container = document.querySelector('.overflow-x-scroll');
        const containerWidth = container.clientWidth;
        const cardOffsetLeft = card.offsetLeft;
        const cardWidth = card.clientWidth;
        const scrollPosition = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }

    onMount(() => {
        centerCard();

        // Set margin right for the last card so it can be centered correctly.
        let lastCard = document.getElementById(`card_${cards.length - 1}`);
        lastCard.style.marginRight = `${0.4 * windowWidth}px`;
    });
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight}/>

<main class="flex h-[80vh] gap-5 items-center relative">
    <div class="absolute w-full h-4/6 top-0 flex justify-center gap-96 z-20">
        <!-- left -->
        <button onclick={scrollLeft} class="" style:visibility="visible">
            <img src="/assets/svg/arrow.svg" alt="Previous" class="w-8"/>
        </button>
        <!-- right -->
        <button onclick={scrollRight} class="">
            <img src="/assets/svg/arrow.svg" alt="Next" class="w-8 scale-x-[-1]" style:visibility="visible"/>
        </button>
    </div>
    <div class="overflow-x-scroll w-full relative h-full content-end px-[40rem]" style="scrollbar-width: none;">
        <div class="grid grid-flow-col gap-1.5 w-fit justify-items-stretch items-end">
            {#each cards as card, i}
            <div class="min-w-52 transition-all ease-in-out delay-150" id="card_{i}">
                <Card {...card}/>
            </div>
            {/each}
        </div>
    </div>
</main>
