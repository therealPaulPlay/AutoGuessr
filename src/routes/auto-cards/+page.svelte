<script>
    import { onMount } from "svelte";
    import Card from "../../lib/components/Card.svelte";

    let cards = [
    {
        "name": "1",
        "HP": 400,
        "price": 45000,
        "etype": "V10",
        "date": "2024",
        "rarity": "epic",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "2",
        "HP": 500,
        "price": 50000,
        "etype": "V12",
        "date": "2024",
        "rarity": "legendary",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "3",
        "HP": 350,
        "price": 40000,
        "etype": "V8",
        "date": "2024",
        "rarity": "rare",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "4",
        "HP": 300,
        "price": 37500,
        "etype": "V8",
        "date": "2024",
        "rarity": "mystical",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "5",
        "HP": 320,
        "price": 36000,
        "etype": "V8 Turbo",
        "date": "2023",
        "rarity": "rare",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "6",
        "HP": 450,
        "price": 47000,
        "etype": "V10 Turbo",
        "date": "2023",
        "rarity": "epic",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "7",
        "HP": 200,
        "price": 25000,
        "etype": "V6",
        "date": "2024",
        "rarity": "common",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "8",
        "HP": 310,
        "price": 34000,
        "etype": "V8",
        "date": "2022",
        "rarity": "rare",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "9",
        "HP": 600,
        "price": 55000,
        "etype": "V12",
        "date": "2024",
        "rarity": "legendary",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "10",
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

    let scaleFactor = 1;

    function incrementSelectedCard() {
        selectedCard >= cards.length - 1 ? selectedCard = cards.length - 1 : selectedCard++;
    }

    function decrementSelectedCard() {
        selectedCard <= 0 ? selectedCard = 0 : selectedCard--;
    }

    function scrollRight() {
        incrementSelectedCard();
        centerCard();
        console.log(selectedCard);
    }

    function scrollLeft() {
        decrementSelectedCard();
        centerCard();
        console.log(selectedCard);
    }

    function centerCard() {
        const card = document.getElementById(`card_${selectedCard}`);
        card.classList.add('centered-card');
        cards.forEach((c, i) => {
            if (i !== selectedCard) {
                document.getElementById(`card_${i}`).classList.remove('centered-card');
            }
        });

        const container = document.querySelector('.overflow-x-scroll');
        const containerWidth = container.clientWidth;
        const cardWidth = card.clientWidth;
        const cardOffsetLeft = card.offsetLeft;
        const scrollPosition = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }

    onMount(() => {
        centerCard();
    });
</script>

<main class="flex h-[80vh] gap-5 items-center">
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
    <div class="overflow-x-scroll relative h-full content-end px-[40rem]" style="scrollbar-width: none;">
        <div class="flex flex-row items-end">
            {#each cards as card, i}
                <div class="{selectedCard == i ? "min-w-80" : "min-w-40"} transition-all duration-200 ease-in-out mx-1 origin-bottom" id="card_{i}">
                    <Card {...card} scaleFactor={selectedCard == i ? 2 : 1} />
                </div>
            {/each}
        </div>
    </div>
</main>
