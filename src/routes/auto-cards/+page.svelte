<script>
    import { onMount } from "svelte";
    import Card from "../../lib/components/Card.svelte";

    let cards = [
    {
        "name": "Epic Card",
        "HP": 400,
        "price": 45000,
        "etype": "V10",
        "date": "2024",
        "rarity": "epic",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "Legendary Card",
        "HP": 500,
        "price": 50000,
        "etype": "V12",
        "date": "2024",
        "rarity": "legendary",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "Rare Card",
        "HP": 350,
        "price": 40000,
        "etype": "V8",
        "date": "2024",
        "rarity": "rare",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "Mystical Card",
        "HP": 300,
        "price": 37500,
        "etype": "V8",
        "date": "2024",
        "rarity": "mystical",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "Shadow Card",
        "HP": 320,
        "price": 36000,
        "etype": "V8 Turbo",
        "date": "2023",
        "rarity": "rare",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "Flame Card",
        "HP": 450,
        "price": 47000,
        "etype": "V10 Turbo",
        "date": "2023",
        "rarity": "epic",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "Common Card",
        "HP": 200,
        "price": 25000,
        "etype": "V6",
        "date": "2024",
        "rarity": "common",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "Crystal Card",
        "HP": 310,
        "price": 34000,
        "etype": "V8",
        "date": "2022",
        "rarity": "rare",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "Titan Card",
        "HP": 600,
        "price": 55000,
        "etype": "V12",
        "date": "2024",
        "rarity": "legendary",
        "image": "/assets/img/example/cardcar.png"
    },
    {
        "name": "Obsidian Card",
        "HP": 380,
        "price": 42000,
        "etype": "V8",
        "date": "2023",
        "rarity": "epic",
        "image": "/assets/img/example/cardcar.png"
    }
]


    // THESE ARE INDEX VALUES
    let selectedCard = $state(0);
    let amountVisible = 3;
    
    let leftStart = $derived.by(() => {
        let leftStart = selectedCard - amountVisible;
        console.log("Left Start CAL: ", leftStart);
        if (leftStart < 0) {
            leftStart = 0;
        }

        if (cards.length - selectedCard < amountVisible + 1) {
            leftStart = leftStart - (4 - (cards.length - selectedCard));
            console.log("cards.length - selectedCard: ", cards.length - selectedCard);
        }

        return leftStart;
    });
    let leftEnd = $derived(selectedCard - 1);
    let rightStart = $derived(selectedCard + 1);
    let rightEnd = $derived(selectedCard < 3 ? (3 - selectedCard) + selectedCard + amountVisible : selectedCard + amountVisible);

</script>

<main class="flex justify-center items-baseline h-[70vh] gap-5">
    <div class="h-1/2 flex gap-2">
        {#if selectedCard != 0}
            {#each cards.slice(leftStart, leftEnd + 1) as card}
                <Card {...card}/>
            {/each}
        {/if}
    </div>
    <div class="h-full relative">
        <div class="h-full">
            <Card {...cards[selectedCard]}/>
        </div>
        <div class="absolute w-full h-4/6 top-0 flex justify-between ">
            <button onclick={() => selectedCard--} class="-translate-x-14" style:visibility="{selectedCard == 0 ? `hidden` : `visible`}">
                <img src="/assets/svg/arrow.svg" alt="Previous" class="w-8"/>
            </button>
            <button onclick={() => selectedCard++} class="translate-x-14">
                <img src="/assets/svg/arrow.svg" alt="Next" class="w-8 scale-x-[-1]" style:visibility="{selectedCard == cards.length-1 ? `hidden` : `visible`}"/>
            </button>
        </div>
    </div>
    <div class="h-1/2 flex gap-2">
        {#if selectedCard != cards.length - 1}
            {#each cards.slice(rightStart, rightEnd + 1) as card}
                <Card {...card}/>
            {/each}
        {/if}
    </div>
</main>