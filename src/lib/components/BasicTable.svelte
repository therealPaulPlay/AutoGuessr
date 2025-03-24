<script>
	let { array, emptyMessage } = $props();
</script>

<div class="w-full bg-tanLight rounded-lg px-3 overflow-scroll max-h-32 overflow-x-hidden no-last-border">
	{#if array.length > 0}
		{#each array as ele}
			<div class="w-full py-1 text-center text-black truncate border-b-2 border-black/10">
				{ele.id}
			</div>
		{/each}
	{:else}
		<div class="w-full py-1 text-center text-black truncate border-b-2 border-black/10">
			{emptyMessage}
		</div>
	{/if}
</div>

<style>
	.no-last-border > div:last-child {
		border-bottom: none !important;
	}
</style>
