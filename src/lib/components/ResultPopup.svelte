<script>
	import Popup from "./Popup.svelte";
	import GuessDisplay from "./GuessDisplay.svelte";
	import Button from "./Button.svelte";
	import { ArrowRightCircle } from "lucide-svelte";
	import { fly, slide } from "svelte/transition";
	import { resultPopup } from "$lib/stores/uiStore";
	import { penaltyFlag, rewardFlag, blinkingFlag, livesImage, popupMessage } from "$lib/stores/resultPopupStore";
	import { guessResult, question } from "$lib/stores/gameStore";
	import { percentageDifference, goToNextQuestion, pointCalculation } from "$lib/utils/gameFunctions";
</script>

{#if $resultPopup}
	<Popup title="" closeFunction={goToNextQuestion} showCloseButton={false}>
		{#if $penaltyFlag || $rewardFlag}
			<div in:fly|global={{ y: 50, delay: 1000 }} class="lives absolute z-[-1] right-0 -top-28">
				<img src="/assets/svg/traffic_{$livesImage}.svg" alt="lives" class="h-24 flex content-end" />
			</div>
		{/if}
		<div class="h-full flex flex-col justify-evenly items-center">
			<div class="flex flex-col items-center">
				<p in:fly={{ y: -50, delay: 500 }} class="font-bold text-green text-7xl mb-5 text-center">
					{$popupMessage}
				</p>
				<p class="text-black text-base text-center" in:fly={{ y: -50, delay: 500 }}>
					Your guess of <span class="text-orange font-semibold">${$guessResult.toLocaleString()}</span>
					was
					<span class="text-orange font-semibold">{percentageDifference().toFixed(2)}% off.</span>
				</p>
				<div in:slide={{ delay: 1500 }} class="text-black text-base text-center flex">
					You get <span class="text-green font-semibold">&nbsp;{pointCalculation(true)} experience.</span>
				</div>
			</div>
			<div class="w-full h-14 mt-14">
				<GuessDisplay
					answer={$question.answer}
					guess={$guessResult}
					percentageDifference={percentageDifference().toFixed(2)}
				/>
			</div>
			<div in:fly={{ x: -50, delay: 2500 }} class="mt-10">
				<Button buttonWidth="12rem" buttonHeight="4rem" onclick={goToNextQuestion}>
					<span class="text-white text-xl font-medium flex items-center justify-center gap-2"
						>Next <ArrowRightCircle strokeWidth={3} /></span
					>
				</Button>
			</div>
		</div>
	</Popup>
{/if}
