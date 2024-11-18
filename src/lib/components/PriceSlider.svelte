<script>
    let {
        sliderMin=1,
        sliderMax=500_000,
        children
    } = $props();

    let guess = $state(0);

    function onGuessChange() {
        
    }

</script>

<div class="flex flex-row items-center h-[4.2rem] rounded-lg bg-tanLight p-2 drop-shadow-[0_0.3rem_0_var(--white-shadow)]">
    <div>
        <input type="range" step="1" min={sliderMin} max={sliderMax} bind:value={guess} onchange={onGuessChange} class="slider" />
    </div>
    <div class="flex items-center justify-center bg-white text-xl p-2 px-4 rounded-md h-full ml-2 text-orange font-bold min-w-32">
        <input type="number" bind:value={guess} class="w-full h-full bg-transparent text-center" />
    </div>
</div>

<style>
    .slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 0.75rem;
        border-radius: 9999px;;
        background: var(--default-shadow);
        outline: none;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        border: 0;
        width: 2rem;
        height: 2rem;
        background: url('/assets/svg/slider.svg') no-repeat;
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        border: 0;
        height: 200%;
        width: 2rem;
        height: 2rem;
        background: url('/assets/svg/slider.svg') no-repeat;
        cursor: pointer;
    }

    /*  TODO:   Make the input arrows disappear on Chrome too. 
                Figure out why chrome shows slider thinner. 
                Make input outline disappear. 
    */

    input[type=number] {
        -moz-appearance: textfield;
        appearance: textfield;
    }

</style>