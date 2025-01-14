<script>
	import { howToPlayPopup } from "$lib/stores/uiStore";
	import { difficultyRules } from "$lib/stores/gameStore";
	import Popup from "./Popup.svelte";
	import Tab from "./Tab.svelte";
</script>

{#if $howToPlayPopup}
	<Popup title="" tall={true} closeFunction={() => ($howToPlayPopup = false)}>
		<div class="w-full text-green flex justify-center text-5xl font-bold -mt-12 mb-12">How to play</div>
		<div class="h-full max-h-[50dvh] overflow-auto">
			<h1 class="text-3xl font-bold mb-4">Guess the price</h1>
			<p class="text-base">
				You'll be shown a car listing, and your task is to guess its price. The closer your guess is to the actual
				price, the more points you'll earn.
			</p>
			<h1 class="text-3xl font-bold mb-4 mt-8">Difficulties</h1>
			<p class="text-base">
				The <span class="text-greenDark font-semibold">Safe range</span> is the range where you will get points and not
				lose any lives. However, if you manage to land in the
				<span class="text-green font-semibold">Reward range,</span> you will get an extra life!
			</p>
			<div class="flex items-center gap-4 overflow-hidden mt-2 flex-wrap">
				<div class="basis-1/4">
					<Tab color="var(--green-button)" selected={false} onclick={() => {}}>
						<span class="text-xl font-medium">Easy</span>
					</Tab>
				</div>
				<div class="flex w-full flex-wrap gap-4">
					<p class="text-base">
						Safe range: <span class="text-greenDark font-semibold">0% — {$difficultyRules[1].correctTier[1]}%</span>
					</p>
					<p class="text-base">
						Reward range: <span class="text-green font-semibold">0% — {$difficultyRules[1].correctTier[0]}%</span>
					</p>
				</div>
			</div>
			<div class="flex items-center gap-4 overflow-hidden mt-2 flex-wrap">
				<div class="basis-1/4">
					<Tab color="var(--default-button)" selected={false}>
						<span class="text-xl font-medium">Medium</span>
					</Tab>
				</div>
				<div class="flex w-full flex-wrap gap-4">
					<p class="text-base">
						Safe range: <span class="text-greenDark font-semibold">0% — {$difficultyRules[2].correctTier[1]}%</span>
					</p>
					<p class="text-base">
						Reward range: <span class="text-green font-semibold">0% — {$difficultyRules[2].correctTier[0]}%</span>
					</p>
				</div>
			</div>
			<div class="flex items-center gap-4 overflow-hidden mt-2 flex-wrap">
				<div class="basis-1/4">
					<Tab color="rgb(75, 73, 73)" selected={false}>
						<span class="text-xl font-medium">Hard</span>
					</Tab>
				</div>
				<div class="flex w-full flex-wrap gap-4">
					<p class="text-base">
						Safe range: <span class="text-greenDark font-semibold">0% — {$difficultyRules[3].correctTier[1]}%</span>
					</p>
					<p class="text-base">
						Reward range: <span class="text-green font-semibold">0% — {$difficultyRules[3].correctTier[0]}%</span>
					</p>
				</div>
			</div>
		</div>
	</Popup>
{/if}
