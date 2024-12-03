<script>
    import { onMount } from "svelte";
    let {
        color="var(--default-button)",
        bgcolor="var(--default-button-dark)",
        buttonWidth = "3.25rem",
        buttonHeight = "3.25rem",
        shadowHeight = "0.3rem",
        execFunction,
        border = false,
        children
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
        class="rounded-lg z-10 ease-out duration-150 px-3 w-full flex items-center justify-center box-border {border ? "border border-white border-4" : ""}"
        bind:this={button}
        onpointerup={shiftButtonUp}
        onpointerdown={pressButtonDown}
        onpointerout={shiftButtonUp}
        ontouchstart={pressButtonDown}
        ontouchend={shiftButtonUp}
        ontouchcancel={shiftButtonUp}
        onclick={execFunction}
        >
        {@render children?.()}
    </button>
    <!-- Shadow/Depth -->
    <div
        class="rounded-lg absolute w-full box-border {border ? "border border-white border-4" : ""}"
        style:background-color={bgcolor}
        style="height: calc(100% - {shadowHeight}"
        style:margin-top={shadowHeight}>
    </div>
</div>