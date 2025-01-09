<script>
    let {
        color,
        selectedColor = color,
        shadow = true,
        selected = false,
        onclick,
        children,
    } = $props();
</script>

<div class="ease-in-out duration-300 transition active:scale-90" class:high-z-index={selected}>
    <button
        class:selected-outline={selected}
        onclick={onclick}
        class="px-3 pt-1 pb-4 rounded-t-lg translate-y-2 w-full truncate text-white m-0 transition"
        style:background-color={selected ? selectedColor : color}
        style:box-shadow={shadow
            ? "0 -0.75rem 0 0 rgba(0,0,0,0.25) inset"
            : null}>
        {@render children?.()}
    </button>
</div>

<style>
    .selected-outline {
        z-index: 20;
    }

    :global(.selected-outline span) {
        text-decoration: underline;
        text-decoration-thickness: 2px;
        text-decoration-color: var(--tan-light);
    }

    .high-z-index {
        z-index: 10;
    }
</style>
