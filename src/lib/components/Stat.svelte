<script>
    let {
        icon,
        text,
        children
    } = $props();

</script>

<div class="flex flex-row items-center bg-white rounded-2xl py-3 px-5 w-full">
    <img src="{icon}" alt="Stat icon" class="w-8 h-8"/>
    <div class="flex ml-10 mr-5">
        <span class="text-2xl font-medium text-orange">{text}</span>
        {#if children}
            {@html children}
        {/if}
    </div>
</div>