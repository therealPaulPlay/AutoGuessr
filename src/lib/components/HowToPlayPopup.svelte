<script>
	import { howToPlayPopup } from "$lib/stores/uiStore";
	import { difficultyRules } from "$lib/stores/gameStore";
	import Popup from "./Popup.svelte";
	import Tab from "./Tab.svelte";
</script>

{#if $howToPlayPopup}
	<Popup tall={true} closeFunction={() => ($howToPlayPopup = false)} title="How to play">
		<div class="h-full max-h-[50dvh] overflow-auto text-black">
			<h1 class="text-2xl font-semibold mb-2 mt-2">The goal</h1>
			<p class="text-base">
				You are shown a car listing and your task is to guess its price. You start out with 3 lives (represented by a
				traffic light) and it's your goal to survive for as long as possible.
			</p>
			<h1 class="text-2xl font-semibold mb-2 mt-6">Scores & Lives</h1>
			<p class="text-base mb-8">
				If your guess is in the <span class="text-greenDark font-semibold">correct range</span>, your score increases by
				1 and you don't lose any lives. However, if you manage to land in the
				<span class="text-green font-semibold">reward range,</span> you get an extra life!
			</p>
			<div class="flex items-center gap-3 mb-4 overflow-hidden mt-2 flex-wrap">
				<span class="text-base font-semibold text-green">Easy:</span>
				<p class="text-base">
					Correct range: <span class="text-greenDark font-semibold">0% — {$difficultyRules[1].correctTier[1]}%</span>
				</p>
				<p class="text-base">
					Reward range: <span class="text-green font-semibold">0% — {$difficultyRules[1].correctTier[0]}%</span>
				</p>
			</div>
			<div class="flex items-center gap-3 mb-4 overflow-hidden mt-2 flex-wrap">
				<span class="text-base font-semibold text-orange">Medium:</span>
				<p class="text-base">
					Correct range: <span class="text-greenDark font-semibold">0% — {$difficultyRules[2].correctTier[1]}%</span>
				</p>
				<p class="text-base">
					Reward range: <span class="text-green font-semibold">0% — {$difficultyRules[2].correctTier[0]}%</span>
				</p>
			</div>
			<div class="flex items-center gap-3 overflow-hidden mt-2 flex-wrap">
				<span class="text-base font-semibold text-black">Hard:</span>
				<p class="text-base">
					Correct range: <span class="text-greenDark font-semibold">0% — {$difficultyRules[3].correctTier[1]}%</span>
				</p>
				<p class="text-base">
					Reward range: <span class="text-green font-semibold">0% — {$difficultyRules[3].correctTier[0]}%</span>
				</p>
			</div>
		</div>
	</Popup>
{/if}
