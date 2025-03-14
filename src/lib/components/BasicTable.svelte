<script>
	let { array } = $props();
</script>

<div class="w-full bg-tanLight rounded-lg px-3 overflow-scroll max-h-32 overflow-x-hidden">
	{#each array as ele}
        <div class="w-full py-1 text-center text-black truncate border-b-2 border-black/10">
            {ele}
        </div>
    {/each}
</div>
