<script>

    let {
        name="N/A",
        HP=0,
        price=0,
        etype="N/A",
        date="N/A",
        rarity="common",
        image="",
        children
    } = $props();

    console.log(rarity);
</script>

<div class=" h-full relative">
    <img src="/assets/svg/{rarity}_front.svg" alt="Card" class="w-full h-full"/>
    <div class="absolute top-0 left-0 w-full h-full flex flex-col justify-between items-center">
        <div class="h-2/5 flex items-center realtive">
            <h1 class="z-20 text-white text-4xl font-bold font-batuphat">{name}</h1>
            <h1 class="{rarity}-extrude absolute z-10 text-4xl font-bold font-batuphatExtrude">{name}</h1>
        </div>
        <div class="h-1/5 w-4/6 mt-4 pl-8 gap-y-3 gap-x-20 {rarity} grid grid-cols-2 gap-x-16 items-center">
            <p class="text-sm font-bold">{HP} HP</p>
            <p class="text-sm font-bold">${price.toLocaleString()}</p>
            <p class="mb-[0.1rem] text-sm font-bold">{etype}</p>
            <p class="mb-[0.1rem] text-sm font-bold">{date}</p>
        </div>
        <div class="h-2/5">
            <img src="{image}" alt="Car" class="w-full h-full"/>
        </div>
    </div>
</div>

<style>
    .mystical p {
        color: var(--mystical);
    }

    .mystical-extrude {
        color: var(--extrude-mystical);
    }
</style>