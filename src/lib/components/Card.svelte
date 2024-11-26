<script>
    import { onMount } from "svelte";
    import { derived } from "svelte/store";

    let {
        name = "N/A",
        HP = 0,
        price = 0,
        etype = "N/A",
        date = "N/A",
        rarity = "common",
        image = "",
    } = $props();

    // let componentWidth = $state();
    // let w = $derived(componentWidth * scaleFactor);
    let w = $state();
    let h = $state();
    let titleSize = $derived(0.1 * w);
    let titleTop = $derived(0.15 * h);
    let statSize = $derived(0.038 * w);
    let statPadding = $derived(0.1 * w);
    let rowGap = $derived(0.064 * h);
    let colGap = $derived(0.2 * w);
    let statTop = $derived(0.433 * h);
    let imgBottom = $derived(0.05 * h);
    let imgPadding = $derived(0.1 * w);
</script>

<div class="h-full relative" bind:clientWidth={w} bind:clientHeight={h}>
    <img
        src="/assets/svg/{rarity}_front.svg"
        alt="Card"
        class="w-full h-full" />
    <div
        class="absolute top-0 left-0 w-full h-full flex flex-col justify-between items-center">
        <div class="title-size flex items-center absolute px-5 text-wrap" style="top: {titleTop}px">
            <h1
                class="z-20 text-white font-bold font-batuphat"
                style="font-size: {titleSize}px">
                {name}
            </h1>
            <h1
                class="{rarity}-extrude absolute z-10 font-bold font-batuphatExtrude"
                style="font-size: {titleSize}px">
                {name}
            </h1>
        </div>
        <div
            class="w-4/6 {rarity} grid grid-cols-2 items-center absolute"
            style="padding-left: {statPadding}px; gap: {rowGap}px {colGap}px; top:{statTop}px">
            <p
                class="font-bold text-nowrap overflow-hidden"
                style="font-size: {statSize}px">
                {HP} HP
            </p>
            <p
                class="font-bold text-nowrap overflow-hidden"
                style="font-size: {statSize}px">
                ${price.toLocaleString()}
            </p>
            <p
                class="font-bold text-nowrap overflow-hidden"
                style="font-size: {statSize}px">
                {etype}
            </p>
            <p
                class="font-bold text-nowrap overflow-hidden"
                style="font-size: {statSize}px">
                {date}
            </p>
        </div>
        <div class="h-2/5 absolute" style="bottom: {imgBottom}px; padding: {imgPadding}px;">
            <img src={image} alt="Car" class="min-h-full" />
        </div>
    </div>
</div>

<style>
    .title-size h1 {
        font-size: calc(1rem + 1vw);
    }

    .mystical p {
        color: var(--mystical);
    }
    .mystical-extrude {
        color: var(--extrude-mystical);
    }

    .legendary p {
        color: var(--legendary);
    }
    .legendary-extrude {
        color: var(--extrude-legendary);
    }

    .epic p {
        color: var(--epic);
    }
    .epic-extrude {
        color: var(--extrude-epic);
    }

    .rare p {
        color: var(--rare);
    }
    .rare-extrude {
        color: var(--extrude-rare);
    }

    .common p {
        color: var(--common);
    }
    .common-extrude {
        color: var(--extrude-common);
    }
</style>
