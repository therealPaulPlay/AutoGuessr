<script>
	import Carousel from "$lib/components/Carousel.svelte";
	import Tab from "$lib/components/Tab.svelte";
	import Stat from "$lib/components/Stat.svelte";
	import PriceSlider from "$lib/components/PriceSlider.svelte";
	import Button from "$lib/components/Button.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import GuessDisplay from "$lib/components/GuessDisplay.svelte";
	import { goto } from "$app/navigation";
	import { ArrowRightCircle, Check, Heart, HeartCrack, Info } from "lucide-svelte";
	import { fly, slide } from "svelte/transition";
	import {
		difficulty,
		lives,
		score,
		difficultyRules,
		gameRounds,
		currentCarouselIndex,
		question,
		guessResult,
		totalCarAmount,
		imgElement,
		priceRange,
	} from "$lib/stores/gameStore";
	import { baseUrl } from "$lib/stores/apiConfigStore";
	import { fetchWithErrorHandling } from "$lib/utils/fetch";
	import { onDestroy, onMount } from "svelte";
	import { get } from "svelte/store";
	import { displayError } from "$lib/utils/displayError";
	import { resultPopup } from "$lib/stores/uiStore";
	import { getTotalCarDataAmount, goToNextQuestion, percentageDifference } from "$lib/utils/gameFunctions";
	import { rewardFlag, penaltyFlag, blinkingFlag, livesImage, popupMessage } from "$lib/stores/resultPopupStore";
	import MultiplayerDrawer from "$lib/components/MultiplayerDrawer.svelte";
	import { currentPlayers, multiplayerFlag, peer } from "$lib/stores/multiplayerStore";
	import { leaveMultiplayerRoom, updatePlayerInGame, updatePlayerScore } from "$lib/utils/multiplayer";

	// Carousel controls
	let descriptionFlag = $state(false);
	let imageTab = $state(true);

	function addLife(amount) {
		$penaltyFlag = false;
		$rewardFlag = true;
		lives.update((value) => {
			return Math.min(value + amount, 5);
		});
	}

	function subtractLife(amount) {
		$rewardFlag = false;
		$penaltyFlag = true;
		lives.update((value) => {
			return Math.max(value - amount, 1);
		});
	}

	function checkPlayerPerformance(percent) {
		const rules = $difficultyRules[$multiplayerFlag ? get(peer).getStorage.difficulty : $difficulty];
		if (!rules) throw new Error("Invalid difficulty level.");

		const [lowerBound, upperBound] = rules.correctTier;

		if (percent <= upperBound) {
			setPopupMessage("good");
			$score++;
			if($multiplayerFlag) updatePlayerScore($peer.id, $score);
		}

		if (percent <= lowerBound) {
			setPopupMessage("great");
			addLife(1); // Give the player an extra life if they get it within the lower bound
			return;
		}

		// Check if the player's performance is within the "correct tier"
		if (percent >= lowerBound && percent <= upperBound) {
			$rewardFlag = false;
			return;
		}

		setPopupMessage("bad");
		subtractLife(1);
		return;
	}

	const messages = {
		bad: ["Uh oh...", "Stay strong!", "That's not it!", "Not quite..."],
		good: ["Nice work!", "Keep it up!", "Well done!", "Very good!"],
		great: ["Amazing job!", "Spot on!", "Keep shining!", "Just wow!"],
	};

	function setPopupMessage(condition) {
		if (!messages[condition]) return console.warn("Invalid condition provided.");
		const conditionMessages = messages[condition];
		$popupMessage = conditionMessages[Math.floor(Math.random() * conditionMessages.length)];
	}

	let blinkInterval;

	// Live (Traffic light) image + blinking state
	$effect(() => {
		if ($blinkingFlag) {
			clearInterval(blinkInterval);
			blinkInterval = setInterval(() => {
				livesImage.set($livesImage == 3 ? 0 : 3); // Toggle between on and off
			}, 1000);
		} else {
			clearInterval(blinkInterval);
			livesImage.set($lives);
		}
	});

	$effect(() => {
		if($multiplayerFlag && $currentPlayers?.length <= 1) {
			goto("/");
			leaveMultiplayerRoom();
			displayError("Room closed because all other players have left.");
		}
	})

	onDestroy(() => {
		clearInterval(blinkInterval);
	});

	onMount(async () => {
		// Resets
		lives.set(4);
		score.set(0);
		currentCarouselIndex.set(0);
		const img = get(imgElement);
		if (img) img.src = "";
		$gameRounds = [];

		if ($multiplayerFlag) {
			updatePlayerInGame(get(peer).id, true);
		}

		$totalCarAmount = await getTotalCarDataAmount();
		goToNextQuestion(false); // Don't save last question to history (false)
	});
</script>

<svelte:window
	onkeydown={() => {
		if (event.key === "Enter" && !$resultPopup) {
			checkPlayerPerformance(percentageDifference());
			resultPopup.set(true);
		}
	}}
/>

<svelte:head>
	<title>Game</title>
</svelte:head>

<!-- main view with car images and stats -->
<content class="flex w-full justify-center z-50">
	<div class="rounded-2xl w-full md:w-4/6 md:max-lg:w-5/6 mx-2 max-md:mb-52">
		<div class="flex w-1/2 gap-2 ml-4">
			<!-- Images and About tabs -->
			<Tab
				color={imageTab ? "var(--white)" : "var(--default-shadow)"}
				shadow={false}
				onclick={() => {
					imageTab = true;
					descriptionFlag = false;
				}}
			>
				<span class="text-xl text-black">Images</span>
			</Tab>
			<Tab
				color={imageTab ? "var(--default-shadow)" : "var(--white)"}
				shadow={false}
				onclick={() => {
					imageTab = false;
					descriptionFlag = true;
				}}
			>
				<span class="text-xl text-black">About</span>
			</Tab>
		</div>
		<div class="flex flex-col w-full md:flex-row gap-5 min-h-[60dvh] lg:max-h-[60dvh] md:max-lg:h-[60dvh]">
			<div class="md:w-2/3 w-full basis-4/6">
				<Carousel images={$question.images} description={$question.description} {descriptionFlag} />
			</div>
			<div class="basis-2/6 min-w-64 rounded-2xl bg-white w-full flex flex-col min-h-full gap-2.5 p-2.5 overflow-auto">
				{#each $question.stats as stat}
					<Stat icon={stat.icon} text={stat.text} />
				{/each}
				<div class="flex flex-row items-center justify-center rounded-lg py-3 px-5 w-full mt-auto">
					<p class="text-lg text-defaultShadowDark font-medium">
						Data provided by <a class="underline text-orange" target="_blank" href="https://auto.dev">Auto.dev</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</content>

<!-- Bottom UI -->
<div class="fixed bottom-0 w-full pointer-events-none z-20 flex justify-center px-2">
	<div class="flex flex-row-reverse justify-center md:gap-10 max-md:flex-col max-md:w-full max-md:items-end">
		<!-- Lives -->
		<div class="lives z-[1] max-md:translate-y-1/4 max-md:mr-10">
			<img src="/assets/svg/traffic_{$livesImage || 0}.svg" alt="lives" class="w-52 max-md:w-40 flex content-end" />
		</div>
		<div class="p-2.5 rounded-t-2xl md:max-w-3xl max-md:w-full flex z-[2] pointer-events-auto bg-defaultShadow">
			<div class="flex grow gap-2.5 text-white w-full">
				<PriceSlider sliderMin={$priceRange?.min} sliderMax={$priceRange?.max} bind:guessValue={$guessResult} />
				<Button
					color="var(--default-button)"
					bgcolor="var(--default-button-dark)"
					buttonHeight="4.5rem"
					buttonWidth="5.5rem"
					onclick={() => {
						checkPlayerPerformance(percentageDifference());
						resultPopup.set(true);
					}}
				>
					<span class="check-align-vertical">
						<Check strokeWidth={5} size={30} />
					</span>
				</Button>
			</div>
		</div>
	</div>
</div>

<!-- Multiplayer drawer -->
{#if $multiplayerFlag}
	<div class="fixed right-0 max-w-[70%] top-1/2 -translate-y-1/2 z-50">
		<MultiplayerDrawer />
	</div>
{/if}

<style>
	.check-align-vertical {
		margin-top: 3px;
	}
</style>
