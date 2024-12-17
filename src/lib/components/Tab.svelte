<script>
    let {
        color,
        selectedColor = color,
        shadow = true,
        tabStatic = false,
        selected = false,
        execFunction,
        children,
    } = $props();

    // TODO: Make tab darker when not selected.
</script>

<div
    class="ease-in-out duration-300 {selected
        ? 'extended-width'
        : 'default-width'}"
    class:static-width={tabStatic}
>
    <button
        class:selected-outline={selected && !tabStatic}
        onclick={execFunction}
        class="px-3 pt-1 pb-4 rounded-t-lg translate-y-2 w-full truncate text-white m-0"
        style:background-color={selected ? selectedColor : color}
        style:box-shadow={shadow
            ? "0 -0.75rem 0 0 rgba(0,0,0,0.25) inset"
            : null}
    >
        {@render children?.()}
    </button>
</div>

<style>
    .extended-width {
        width: 66.666667% !important;
        z-index: 10;
    }
    .static-width {
        width: 33.333333% !important;
    }
    .default-width {
        width: 33.333333%;
    }
    .default-width:hover {
        width: 66.666667%;
    }
    .selected-outline {
        outline: 3px solid whitesmoke; /* Stroke thickness and color */
        outline-offset: 0; /* Controls the gap between the stroke and element */
    }
</style>
