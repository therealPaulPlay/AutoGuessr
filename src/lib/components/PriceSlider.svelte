<script>

    let {
        sliderMin=1,
        sliderMax=500_000,
        children
    } = $props();

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

    let guess = $state(sliderMin);
    let restrictedGuess = $derived(clamp(guess, sliderMin, sliderMax));

    function onGuessChange() {
        
    }

    function formatedGuess() {
        return '$' + restrictedGuess.toLocaleString();
    }

    function preventNonNumericalInput(e) {
        e = e || window;
        var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
        var charStr = String.fromCharCode(charCode);

        if (!charStr.match(/^[0-9]+$/))
            e.preventDefault();
    }

    function selectAllText(e) {
        e.target.select();
        console.log(e.target);
    }

</script>

<div class="flex flex-row items-center h-[4.2rem] rounded-lg bg-tanLight p-2 drop-shadow-[0_0.3rem_0_var(--white-shadow)] ">
    <div>
        <input type="range" step="1" min={sliderMin} max={sliderMax} bind:value={guess} onchange={onGuessChange} class="slider" />
    </div>
    <div class="flex items-center justify-center bg-white text-xl p-2 px-4 rounded-md h-full ml-2 text-orange font-bold min-w-16 relative">
        <span class="w-full h-full bg-transparent text-center">{formatedGuess()}</span>
        <input type="number" bind:value={guess} onchange={formatedGuess()} onkeypress={preventNonNumericalInput} onclick={selectAllText} onfocus={selectAllText} class="absolute w-full h-full" style="opacity: 0;"/>
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

    /*  TODO:   Figure out why chrome shows slider thinner. 
    */

    /* Removes number arrows */
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
        appearance: textfield;
    }

</style>