<script>
    let {
        color="var(--default-button)",
        bgcolor="var(--default-button-dark)",
        buttonWidth,
        buttonHeight = "3.25rem",
        shadowHeight = "0.3rem",
        execFunction,
        border = false,
        children
    } = $props();
    
    let calculatedButtonHeight = "calc(100% - " + shadowHeight + ")";
    let buttonStyle = $state();

    shiftButtonUp();

    function pressButtonDown() {
        buttonStyle = `translate: 0 ${shadowHeight}; background-color: ${color}; height: ${calculatedButtonHeight};`;
    }

    function shiftButtonUp() {
        buttonStyle = `translate: 0 0; background-color: ${color}; height: ${calculatedButtonHeight}`;
    }
</script>

<div
    class="flex h-full relative hover:brightness-110 transition duration-200"
    id="buttonOuterDiv"
    style:width="{buttonWidth || "fit-content"}"
    style:height={buttonHeight}>
    <button
        class="rounded-lg z-10 ease-out duration-150 px-3 w-full flex items-center justify-center box-border bg-orange {border ? "border-white border-4" : ""}"
        style="{buttonStyle}"
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
    <!-- Shadow -->
    <div
        class="rounded-lg absolute w-full box-border {border ? "border-white border-4" : ""}"
        style="height: calc(100% - {shadowHeight}"
        style:background-color={bgcolor}
        style:margin-top={shadowHeight}>
    </div>
</div>