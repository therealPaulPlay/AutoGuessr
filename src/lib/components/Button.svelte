<script>
    import { onMount } from "svelte";
    let {
        color,
        bgcolor,
        imageSize,
        buttonWidth,
        buttonHeight,
        shadowHeight,
        execFunction,
        svg,
    } = $props();

    let button = $state();

    onMount(() => {
        shiftButtonUp();
    });

    function pressButtonDown() {
        button.style = `translate: 0 ${shadowHeight}; background-color: ${color}; height: ${calculatedButtonHeight};`;
    }

    function shiftButtonUp() {
        button.style = `translate: 0 0; background-color: ${color}; height: ${calculatedButtonHeight}`;
    }

    let calculatedButtonHeight = "calc(100% - " + shadowHeight + ")";
</script>

<div
    class="flex h-full relative"
    id="buttonOuterDiv"
    style:width={buttonWidth}
    style:height={buttonHeight}>
    <button
        class="rounded-lg z-10 ease-out duration-300 px-3 w-full flex items-center justify-center"
        bind:this={button}
        onpointerup={shiftButtonUp}
        onpointerdown={pressButtonDown}
        onpointerout={shiftButtonUp}
        ontouchstart={pressButtonDown}
        ontouchend={shiftButtonUp}
        ontouchcancel={shiftButtonUp}
        onclick={execFunction}
        >
        <img src={svg} alt="Back arrow" style:width={imageSize} />
    </button>
    <div
        class="rounded-lg absolute w-full"
        style:background-color={bgcolor}
        style="height: calc(100% - {shadowHeight}"
        style:margin-top={shadowHeight}>
    </div>
</div>