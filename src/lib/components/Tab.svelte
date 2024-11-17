<script>
    let {
        color,
        onHover=true,
        children
    } = $props();

    let shrinkSize = "33.333333%"
    let fullSize = "66.666667%"
    let size = $state(shrinkSize)

    // TODO: make it stay full size when clicked

    function active() {
        size = fullSize
    }

    function inactive() {
        size = shrinkSize
    }
</script>

<div 
    class="ease-in-out duration-300" 
    style="width:{size}"
    >
    <button 
        onclick={() => console.log("clicked")}
        class="px-3 pt-1 pb-4 rounded-t-lg translate-y-2 w-full truncate text-white m-0" 
        style:background-color={color}
        onmouseover={onHover ? active : null}
        onfocus={onHover ? active : null}
        onmouseleave={onHover ? inactive : null}
        onfocusout={onHover ? inactive : null}
        >
        {@render children?.()}
    </button>
</div>

<style>
    button {
        box-shadow: 0 -0.75rem 0 0 rgba(0,0,0,0.25) inset;
    }
</style>