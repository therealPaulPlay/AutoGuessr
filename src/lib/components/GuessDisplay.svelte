<script>
	import { onMount } from "svelte";
	import { difficulty, difficultyRules } from "$lib/stores/gameStore.js";
	import { gsap } from "gsap";
	import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
	import { fly } from "svelte/transition";
	gsap.registerPlugin(ScrollToPlugin);

	let { answer, guess, percentageDifference } = $props();

	let sectionsAmount = 50;
	const rules = $difficultyRules[$difficulty];
	let [lowerBound, upperBound] = rules.correctTier;

	let markings = $state();
	let guessBand = $state();
	let answerBar = $state();
	let guessBar = $state();
	let answerPrice = $state();
	let guessPrice = $state();

	let showAnswerPrice = $state(false);
	let showGuessPrice = $state(false);
	let pinpointFlag = $state(false);
	let answerPos = $state(0);
	let guessPos = $state(0);
	let answerBarPos = $state(0);
	let guessBarPos = $state(0);

	let difference = percentageDifference > 90 ? 90 : percentageDifference;
	let differenceThreshold = 2;

	function scrollToAnswer() {
		showGuessPrice = false;
		// gsap scroll to
		gsap.to(guessBand, {
			duration: 2,
			scrollTo: {
				x: answerBar,
				offsetX: getMarkingsVisibleWidth() / 2 - 7,
			},
			ease: "expo.inOut",
			onComplete: () => {
				showAnswerPrice = true;
				// For some reason, this is what I had to do to have it positioned correctly.
				setTimeout(() => {
					if (answerBar) positionAnswerPrice();
				}, 50);
			},
		});
	}

	function positionAnswerPrice() {
		if (!answerBar) return;
		answerPos = positionPrice(answerBar, answerPrice);
	}

	function positionGuessPrice() {
		guessPos = positionPrice(guessBar, guessPrice);
	}

	function positionPrice(barElement, priceElement) {
		if (typeof window === "undefined" && !barElement) return;
		if (!priceElement) return console.warn("Price element is undefined!");

		let barOffset = barElement.getBoundingClientRect().left;
		let priceWidth = priceElement.getBoundingClientRect().width;
		let barWidth = barElement.getBoundingClientRect().width;
		let mainWrapperOffset = getMainWrapperOffset();

		let position = barOffset - mainWrapperOffset - priceWidth / 2 + barWidth / 2;

		return position;
	}

	function positionGuessBar() {
		const barScrollWidth = getBarScrollWidth();

		let offset = (barScrollWidth * difference) / 100;
		if (offset >= barScrollWidth / 2) offset = barScrollWidth / 2 - 14;

		if (guess > answer) {
			guessBarPos = answerBarPos + offset;
		} else {
			guessBarPos = answerBarPos - offset;
		}
	}

	function positionAnswerBar() {
		const scrollWidth = getBarScrollWidth();

		let offset = scrollWidth / 2 - 7;
		answerBarPos = offset;
	}

	function getBarScrollWidth() {
		return guessBand.scrollWidth;
	}

	function getMainWrapperOffset() {
		const mainWrapper = document.getElementById("wrapper");
		return mainWrapper.getBoundingClientRect().left;
	}

	function getMarkingsVisibleWidth() {
		if (!markings) return 0;
		return markings.clientWidth;
	}

	onMount(() => {
		positionAnswerBar();
		positionGuessBar();
	});

	onMount(() => {
		setTimeout(() => {
			scrollToAnswer();
		}, 2000);
	});

	onMount(() => {
		if (guess > answer) guessBand.scrollLeft = guessBand.scrollWidth; // Starts at the end of the band if the guess is higher than the answer
		if (difference < 0.5) pinpointFlag = true;
	});

	$effect(() => {
		// I need to figure out why I am getting this weird behaviour when a timeout and duration are not specified.
		if (guessBar) {
			setTimeout(() => {
				gsap.to(guessBand, {
					scrollTo: {
						x: guessBar,
						offsetX: getMarkingsVisibleWidth() / 2 - 7,
					},
					onComplete: () => {
						showGuessPrice = true;
						setTimeout(() => {
							positionGuessPrice();
						}, 50);
					},
					duration: 0.01,
				});
			}, 50);
		}
	});
</script>

<div class="w-full h-full relative" id="wrapper">
	<div
		class="relative w-full h-full bg-tanDark rounded-lg overflow-x-scroll overflow-y-auto guess-band remove-scrollbar pointer-events-none"
		bind:this={guessBand}
	>
		<!-- Line indicators -->
		<div
			class="absolute z-20 flex bottom-0 justify-center w-3.5 h-full bg-orange overflow-visible outline outline-3 outline-white"
			style:left="{answerBarPos}px"
			bind:this={answerBar}
		></div>
		<div
			class="absolute z-20 flex bottom-0 justify-center w-3.5 h-full bg-black outline outline-3 outline-white"
			class:pinpoint={pinpointFlag}
			style:left="{guessBarPos}px"
			bind:this={guessBar}
		></div>
		<!-- Band markings -->
		<div class="relative flex w-full h-full items-end gap-3 rounded-lg z-10" bind:this={markings}>
			{#if guessBand}
				<!-- This is an absolute disrespect to "clean code" -->
				<div
					class="absolute top-0 z-[2] bg-green h-full"
					style:width="{((getBarScrollWidth() * lowerBound) / 100) * 2}px"
					style:left="{answerBarPos - (getBarScrollWidth() * lowerBound) / 100 + 5}px"
				></div>
				<div
					class="absolute top-0 bg-greenDark h-full"
					style:width="{((getBarScrollWidth() * upperBound) / 100) * 2}px"
					style:left="{answerBarPos - (getBarScrollWidth() * upperBound) / 100 + 5}px"
				></div>
			{/if}
			{#each { length: 10 * sectionsAmount } as _, i}
				<div class="line"></div>
			{/each}
		</div>
	</div>

	<!-- Adding "&& answerBand" should fix the null error that shows in the console I think? -->
	{#if showAnswerPrice && answerBar}
		<div
			transition:fly={{ y: -10, delay: 50 }}
			class="absolute flex items-center flex-col -top-12"
			style:left="{answerPos}px"
			bind:this={answerPrice}
		>
			<div class="text-orange font-semibold text-base">
				${answer.toLocaleString()}
			</div>
			<img src="/assets/svg/simple_arrow.svg" alt="Arrow" class="w-3.5 h-3.5 -rotate-90" />
		</div>
	{/if}
	{#if showGuessPrice && guessBar}
		<div
			transition:fly={{ y: -10, delay: 50 }}
			class="absolute flex items-center flex-col -top-12"
			style:left="{guessPos}px"
			bind:this={guessPrice}
		>
			<div class="text-black font-semibold text-base">
				${guess.toLocaleString()}
			</div>
			<img src="/assets/svg/simple_arrow_black.svg" alt="Arrow" class="w-3.5 h-3.5 -rotate-90" />
		</div>
	{/if}
</div>

<style>
	.line {
		height: 30%;
		opacity: 0.4;
		flex-shrink: 0;
		border-radius: 9999px 9999px 0 0;
		width: 4px;
		z-index: 3;
		background-color: var(--black);
	}

	.remove-scrollbar {
		scrollbar-width: none; /* Hide scrollbar for Firefox */
	}

	.pinpoint {
		background: url("/assets/svg/pinpoint pattern.svg") repeat-x;
		background-size: 400%;
		animation: move-background 2s linear infinite;
	}

	@keyframes move-background {
		0% {
			background-position: 100% 0; /* Start from the right */
		}
		100% {
			background-position: -100% 0; /* Move to the left */
		}
	}
</style>
