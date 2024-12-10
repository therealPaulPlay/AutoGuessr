<script>
    let { answer, guess } = $props();

    let sectionsAmount = 20;
</script>

<!-- <div class="line small"></div>
<div class="line mid"></div>
<div class="line big rounded-full"></div> -->

<div class="w-full h-full relative">
    <div class="flex w-full h-full items-end gap-1 opacity-40 overflow-hidden rounded-lg">
        {#each {length: 10 * sectionsAmount} as _, i}
            {#if i % 10 === 0}
                <div class="line big"></div>
            {:else if i % 5 === 0}
                <div class="line mid"></div>
            {:else}
                <div class="line small"></div>
            {/if}
        {/each}
    </div>
    <!-- The guess band -->
<div class="absolute w-full h-full top-0">
    <div class="relative flex rounded-lg w-fit h-full top-0 left-5 justify-center">
        <div class="absolute flex items-center flex-col -top-12 overflow-visible">
            <div class="text-orange font-semibold text-base">${guess.toLocaleString()}</div>
            <img src="/assets/svg/simple arrow.svg" alt="Arrow" class="w-3.5 h-3.5 -rotate-90" />
        </div>
        <div class="w-3.5 h-full bg-orange"></div>
    </div>
</div>
    <!-- The answer band -->
    <div class="absolute w-full h-full top-0">
        <div class="relative flex rounded-lg w-fit h-full top-0 left-96 justify-center">
            <div class="absolute flex items-center flex-col -top-12 overflow-visible">
                <div class="text-green font-semibold text-base">${answer.toLocaleString()}</div>
                <img src="/assets/svg/simple arrow green.svg" alt="Arrow" class="w-3.5 h-3.5 -rotate-90" />
            </div>
            <div class="w-3.5 h-full bg-green"></div>
        </div>
    </div>
</div>

<style>
    .line {
        flex-shrink: 0;
        border-radius: 9999px;
        width: 4px;
        background-color: var(--black);
    }

    .line.small {
        height: 15%;
    }

    .line.mid {
        height: 30%;
    }

    .line.big {
        height: 50%;
    }
</style>
