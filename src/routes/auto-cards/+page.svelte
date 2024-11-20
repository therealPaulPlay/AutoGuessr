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
    let selectedCard = $state(1);
    let amountVisible = 3;
    
    let cardsVisible = $derived(selectedCard - amountVisible > 0 ? selectedCard - amountVisible : 0);
    let leftEnd = $derived(selectedCard - 1);
    let rightStart = $derived(selectedCard + 1);
    let end = $derived(selectedCard + amountVisible);

    console.log(selectedCard, (selectedCard - amountVisible > 0), leftEnd, rightStart, end);

</script>

<main class="flex justify-center items-baseline h-[70vh] gap-5">
    <div class="h-1/2 flex gap-2">
        {#each cards.slice(cardsVisible, leftEnd + 1) as card}
            <Card {...card}/>
        {/each}
    </div>
    <div class="h-full relative">
        <Card {...cards[selectedCard]}/>
            <button onclick={() => selectedCard--} class="z-20">
                <img src="/assets/svg/arrow.svg" alt="Previous" class="w-8"/>
            </button>
            <button onclick={() => selectedCard++} class="z-20">
                <img src="/assets/svg/arrow.svg" alt="Next" class="w-8 scale-x-[-1]"/>
            </button>
    </div>
    <div class="h-1/2 flex gap-2">
        {#each cards.slice(rightStart, end + 1) as card}
            <Card {...card}/>
        {/each}
    </div>
</main>