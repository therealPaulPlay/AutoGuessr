<script>
    import Card from "../../lib/components/Card.svelte";

    let cards = [
        {
            name: "Mystical Card",
            HP: 300,
            price: 37500,
            etype: "V8",
            date: "2024",
            rarity: "mystical",
            image: "/assets/img/example/cardcar.png"
        },
    ]
</script>

<main class="flex justify-center items-center h-[70vh]">
    {#each cards as card}
        <Card {...card}/>
    {/each}
</main>