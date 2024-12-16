<script>
    let {
        sliderMin = 1,
        sliderMax = 500_000,
        guessValue = $bindable(sliderMin),
        children,
    } = $props();

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

    let restrictedGuess = $derived(clamp(guessValue, sliderMin, sliderMax));

    $effect(() => {
        guessValue = restrictedGuess;
    });

    function onGuessChange() {}

    function formatedGuess() {
        return "$" + restrictedGuess.toLocaleString();
    }

    function preventNonNumericalInput(e) {
        const allowedKeys = [
            "Backspace",
            "Delete",
            "ArrowLeft",
            "ArrowRight",
            "Tab",
            "Home",
            "End",
        ];

        if (allowedKeys.includes(e.key)) return;
        // For other keys, only allow numbers
        if (!e.key.match(/^[0-9]$/)) e.preventDefault();
    }

    function selectAllText(e) {
        e.target.select();
    }

    let inputFocused = $state(false);
</script>

<div
    class="flex items-center h-[4.2rem] rounded-lg bg-tanLight p-2 drop-shadow-[0_0.3rem_0_var(--white-shadow)] gap-2">
    <div class="grow-[2]">
        <input
            type="range"
            step="1"
            min={sliderMin}
            max={sliderMax}
            bind:value={guessValue}
            onchange={onGuessChange}
            class="slider w-full" />
    </div>
    <div
        class="flex items-center justify-center relative bg-white text-xl p-2 rounded-md h-full text-orange font-bold min-w-40 transition {inputFocused
            ? '!bg-orange'
            : ''}">
        <span
            class="w-full h-full bg-transparent text-center custom-vertical-align {inputFocused
                ? 'text-white'
                : ''} transition">{formatedGuess()}</span>
        <input
            type="number"
            maxlength="8"
            bind:value={guessValue}
            onchange={formatedGuess}
            onkeydown={preventNonNumericalInput}
            onclick={selectAllText}
            onfocus={() => {
                inputFocused = true;
            }}
            onfocusout={() => {
                inputFocused = false;
            }}
            class="absolute w-full h-full"
            style="opacity: 0;" />
    </div>
</div>

<style>
    .custom-vertical-align {
        line-height: 35px;
    }
</style>
