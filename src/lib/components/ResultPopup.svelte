<script>
	import Popup from "./Popup.svelte";
	import GuessDisplay from "./GuessDisplay.svelte";
	import Button from "./Button.svelte";
	import { ArrowRightCircle } from "lucide-svelte";
	import { fly, slide } from "svelte/transition";
	import { resultPopup } from "$lib/stores/uiStore";
	import { penaltyFlag, rewardFlag, blinkingFlag, livesImage, popupMessage } from "$lib/stores/resultPopupStore";
	import { guessResult, question, score } from "$lib/stores/gameStore";
	import { percentageDifference, goToNextQuestion, pointCalculation } from "$lib/utils/gameFunctions";
	import { onMount, onDestroy } from "svelte";
	import { isAuthenticated } from "$lib/stores/accountStore";
	import { playClickingSound } from "$lib/utils/playClickingSound";
	import { get } from "svelte/store";

	let showNext = $state(false);
	let showPlusOne = $state(false);
	let animatedScore = $state();

	let showNextTimeout;
	let timeout1, timeout2;

	resultPopup.subscribe((value) => {
		if (value) {
			clearTimeout(showNextTimeout);
			clearTimeout(timeout1);
			clearTimeout(timeout2);

			animatedScore = $penaltyFlag ? $score : $score - 1;

			timeout1 = setTimeout(() => {
				showPlusOne = true;
			}, 2000);
			timeout2 = setTimeout(() => {
				showPlusOne = false;
				animatedScore = $score;
			}, 3250);
			showNextTimeout = setTimeout(() => {
				showNext = true;
			}, 1000);

			setTimeout(playClickingSound, 1750);
		} else {
			showNext = false;
		}
	});
</script>

{#if $resultPopup}
	<Popup closeFunction={goToNextQuestion} showCloseButton={false} closeOnClickOut={false}>
		{#if $penaltyFlag || $rewardFlag}
			<div in:fly|global={{ y: 50, delay: 250 }} class="lives absolute z-[-1] right-0 -top-28">
				<img src="/assets/svg/traffic_{$livesImage || 0}.svg" alt="lives" class="h-24 flex content-end" />
			</div>
		{/if}
		<div class="h-full max-w-full flex flex-col justify-evenly items-center">
			<div class="flex flex-col items-center overflow-hidden">
				<p
					in:fly={{ y: -50, delay: 250 }}
					class="font-bold text-green text-7xl text-nowrap max-md:text-3xl mb-4 text-center"
				>
					{$popupMessage}
				</p>
				<p class="text-black text-base text-center text-wrap md:w-2/3 w-full px-2 mb-1" in:fly={{ y: -50, delay: 500 }}>
					Your guess of <span class="text-orange font-semibold">${$guessResult.toLocaleString()}</span>
					was off by
					<span class="text-orange font-semibold">{percentageDifference().toFixed(2)}%</span>.
					{#if $isAuthenticated}
						You get <span class="text-green font-semibold">{pointCalculation(true)} experience.</span>
					{:else}
						Sign in to earn <span class="text-green font-semibold">experience.</span>
					{/if}
				</p>
			</div>
			<div class="w-full h-14 mt-14">
				<GuessDisplay
					answer={$question.answer}
					guess={$guessResult}
					percentageDifference={percentageDifference().toFixed(2)}
				/>
			</div>
			<div in:fly={{ x: -50, delay: 1500 }} class="mt-10">
				<div class="flex w-full justify-center p-3">
					<span class="relative text-base text-orange font-semibold bg-tanLight px-2 py-1 rounded-lg min-w-28 text-center">
						Score: {animatedScore}
						{#if showPlusOne && !$penaltyFlag}
							<span in:fly={{ y: 20 }} out:fly={{ x: -20 }} class="absolute -right-8 text-orange font-bold">+1</span>
						{/if}
					</span>
				</div>
				<Button buttonWidth="12rem" buttonHeight="4rem" onclick={goToNextQuestion} interactive={showNext}>
					<span class="text-white text-xl font-medium flex items-center justify-center gap-2"
						>Next <ArrowRightCircle strokeWidth={3} /></span
					>
				</Button>
			</div>
		</div>
	</Popup>
{/if}
