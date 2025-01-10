<script>
    let { icon, text = "N/A", children } = $props();
</script>

<div class="flex flex-row items-center bg-tanLight rounded-lg py-3 px-5 w-full">
    {#if icon}
        <img src={icon} alt="Stat icon" class="w-8 h-8" />
    {:else}
        <div class="w-8 h-8 text-orange text-2xl font-extrabold text-center">
            ?
        </div>
    {/if}

    <div class="flex ml-10 mr-5">
        <span class="text-2xl font-medium text-orange"
            >{String(text).charAt(0)?.toUpperCase() + String(text).slice(1) ||
                "N/A"}</span>
        {#if children}
            {@render children?.()}
        {/if}
    </div>
</div>
