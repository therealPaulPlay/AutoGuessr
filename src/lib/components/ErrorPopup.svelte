<script>
	import Popup from "./Popup.svelte";
	import { TriangleAlert } from "lucide-svelte";
	import { errorPopup } from "$lib/stores/uiStore";
	import { errorText } from "$lib/stores/uiStore";
</script>

{#if $errorPopup}
	<Popup title="Error" z={9999} small={true} color="var(--tan-medium)" closeFunction={() => errorPopup.set(false)}>
		<div class="flex h-full items-end">
			<div class="h-3/5 w-full bg-tanLight rounded-lg p-4">
				<div class="mb-4">
					<TriangleAlert color="var(--tan-dark)" strokeWidth={2.5} />
				</div>
				<p class="truncate text-wrap line-clamp-3">
					{$errorText}
				</p>
			</div>
		</div>
	</Popup>
{/if}
