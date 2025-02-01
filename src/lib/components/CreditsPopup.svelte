<script>
	import Popup from "./Popup.svelte";
	import { creditsPopup } from "$lib/stores/uiStore";
</script>

{#if $creditsPopup}
	<Popup
		title="Credits"
		closeFunction={() => {
			creditsPopup.set(false);
		}}
	>
		<ul class="list-disc list-inside">
			<li>Lead devs & game designers: Amr Y. M. Mosalm, Paul Rhomberg</li>
			<li>3D Art: Nika Somkhishvili</li>
			<li>Foliage design: Kayla Artistic</li>
			<li>Sound design: Paul Rhomberg</li>
		</ul>

		<p class="mt-10 italic">
			Copyright {new Date().getFullYear()}
			<a href="https://paulplay.studio" target="_blank" class="hover:underline">PaulPlay</a>. All rights reserved.
		</p>
	</Popup>
{/if}
