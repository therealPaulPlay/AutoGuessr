<script>
	import Carousel from "$lib/components/Carousel.svelte";
	import Tab from "$lib/components/Tab.svelte";
	import Stat from "$lib/components/Stat.svelte";
	import PriceSlider from "$lib/components/PriceSlider.svelte";
	import Button from "$lib/components/Button.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import GuessDisplay from "../../lib/components/GuessDisplay.svelte";
	import { goto } from "$app/navigation";
	import { ArrowRightCircle, Check, Heart, HeartCrack } from "lucide-svelte";
	import { fly, slide } from "svelte/transition";
	import { difficulty, lives, score, difficultyRules, gameRounds, currentCarouselIndex } from "$lib/stores/gameStore";
	import { baseUrl } from "$lib/stores/apiConfigStore";
	import { fetchWithErrorHandling } from "$lib/utils/fetch";
	import { onMount } from "svelte";
	import { get } from "svelte/store";
	import { displayError } from "$lib/utils/displayError";

	const messages = {
		bad: ["Uh oh...", "Stay strong!", "That's not it!", "Not quite..."],
		good: ["Nice work!", "Keep it up!", "Well done!", "Very good!"],
		great: ["Amazing job!", "You're unstoppable!", "Keep shining!", "Just wow!"],
	};

	let question = $state({});

	function milesToKilometers(miles) {
		const conversionFactor = 1.60934;
		return miles * conversionFactor;
	}

	async function setCurrentQuestion(questionId) {
		try {
			const data = await fetchWithErrorHandling(`${$baseUrl}/car-data/standard/${questionId}`).then((response) =>
				response.json(),
			);

			question.id = questionId;
			question.answer = data.price;
			question.images = data.photos;
			question.description = {};
			question.description.text = data.description;
			question.description.coordinates = data.coordinates;
			question.description.vendorURL = data.vendorURL;
			question.stats = [
				{ icon: "/assets/svg/car.svg", text: data.name },
				{
					icon: "/assets/svg/mileage.svg",
					text:
						(data?.mileage || 0).toLocaleString() +
						" mi. / " +
						Math.round(milesToKilometers(data?.mileage || 0)).toLocaleString() +
						" km.",
				},
				{
					icon: "/assets/svg/transmission.svg",
					text: data.transmission,
				},
				{ icon: "/assets/svg/bodyType.svg", text: data.bodyType },
				{ icon: "/assets/svg/engine.svg", text: data.engineType },
				{ icon: "/assets/svg/date.svg", text: data.year },
				{ icon: "/assets/svg/owner.svg", text: data.condition },
			];
		} catch (error) {
			console.error("Error occured retrieving car data:", error);
			displayError("Error occured retrieving car data: " + error);
		}
	}

	let resultPopup = $state(false);
	let rewardFlag = $state(false);
	let penaltyFlag = $state(false);
	let extraPenaltyFlag = $state(false);
	let blinkingFlag = $state(false);
	let descriptionFlag = $state(false);
	let imageTab = $state(true);
	let blinkingLives = $state();
	let blinkingLivesPopup = $state();
	let popupMessage = $state("Loading...");
	let nextButton = $state();
	let livesImage = $state(3);
	let guessResult = $state(1);
	let availableIndexArr = $state([]);
	let submitButton;
	const range = $derived.by(() => {
		return getValueRange(question.answer);
	});
	score.set(0);

	async function getAvailableDataSize() {
		try {
			const response = await fetchWithErrorHandling(`${$baseUrl}/car-data/amount`);
			const data = await response.json();
			return data.total;
		} catch (error) {
			console.error("Error occured getting the available car dataset size:", error);
			displayError("Error occured getting the available car dataset size: " + error);
		}
	}

	function removeCommonElements(arr1, arr2) {
		if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
			throw new Error("Both inputs must be arrays");
		}
		const set2 = new Set(arr2);
		return arr1.filter((item) => !set2.has(item));
	}

	function updateAvailableIndexArr() {
		let array = JSON.parse(localStorage.getItem("indexHistory")) || [];
		availableIndexArr = removeCommonElements(availableIndexArr, array);
	}

	function addIndexToLocalStorage(index) {
		let array = JSON.parse(localStorage.getItem("indexHistory")) || [];
		array.push(index);
		localStorage.setItem("indexHistory", JSON.stringify(array));
	}

	// TODO: make this follow the "Do one thing" principle better
	async function getAvailableIndex() {
		const size = await getAvailableDataSize();
		const randomIndex = Array.from({ length: size }, (_, i) => i);
		let indexHistory = JSON.parse(localStorage.getItem("indexHistory")) || [];
		let availableIndex = removeCommonElements(randomIndex, indexHistory);

		// If somehow all indexes are used, it'll just default to the random index
		if (availableIndex.length === 0) availableIndex = randomIndex;
		availableIndexArr = availableIndex;
	}

	function displayImages() {
		imageTab = true;
		descriptionFlag = false;
	}

	function displayDescription() {
		imageTab = false;
		descriptionFlag = true;
	}

	function showResult() {
		checkPlayerPerformance(percentageDifference());

		resultPopup = true;
	}

	function percentageDifference() {
		// Avoid division by zero
		if (question.answer === 0 && guessResult === 0) return 0;

		// Calculate the base as the average of absolute values
		const base = (Math.abs(question.answer) + Math.abs(guessResult)) / 2;

		// Calculate the absolute difference
		const difference = Math.abs(question.answer - guessResult);

		// Calculate percentage
		const percentage = (difference / base) * 100;
		return percentage;
	}

	function pointCalculation() {
		let difference = percentageDifference();
		if (difference > 100) return 0;

		let maxPoints = 500;
		let points = Math.round(((100 - difference) / 100) * maxPoints);
		return points;
	}

	function checkPlayerPerformance(percent) {
		const rules = $difficultyRules[$difficulty];
		if (!rules) {
			throw new Error("Invalid difficulty level.");
		}

		const [lowerBound, upperBound] = rules.correctTier;

		if (percent <= upperBound) {
			setPopupMessage("good");
			addScore(1);
		}

		if (percent <= lowerBound) {
			// Give the player an extra life if they get it within the lower bound
			setPopupMessage("great");
			addLife(1);
			return;
		}

		// Check if the player's performance is within the "correct tier"
		if (percent >= lowerBound && percent <= upperBound) {
			rewardFlag = false;
			return;
		}

		// Check if the penalty logic applies (only for difficulty 3)
		if ($difficulty === 3 && percent > rules.penaltyThreshold) {
			subtractLife(2, true);
			return;
		}

		setPopupMessage("bad");
		subtractLife(1);
		return;
	}

	function addLife(amount) {
		penaltyFlag = false;
		extraPenaltyFlag = false;
		rewardFlag = true;
		lives.update((l) => {
			return l + amount > 4 ? 4 : l + amount;
		});
	}

	function subtractLife(amount, extraPenalty = false) {
		rewardFlag = false;
		penaltyFlag = true;
		extraPenaltyFlag = extraPenalty;
		lives.update((l) => {
			return l - amount < 0 ? 0 : l - amount;
		});
	}

	function addScore(amount) {
		score.update((c) => c + amount);
	}

	function goToNextQuestion() {
		$gameRounds.push({
			id: question.id,
			guess: guessResult,
			answer: question.answer,
			difference: percentageDifference(),
			points: pointCalculation(),
			rewardFlag,
			penaltyFlag,
		});

		addIndexToLocalStorage(question.id);
		updateAvailableIndexArr();

		// !TODO This whole feature needs a lot of simplification I swear, this can't be right.
		let newIndex = Math.floor(Math.random() * availableIndexArr.length);
		setCurrentQuestion(availableIndexArr[newIndex]);

		// Resets
		guessResult = 1;
		rewardFlag = false;
		penaltyFlag = false;
		resultPopup = false;
		$currentCarouselIndex = 0;

		if ($lives <= 0) {
			// Redirect to the game over page
			goto("/game/end");
			return;
		}
	}

	function setPopupMessage(condition) {
		if (messages[condition]) {
			const conditionMessages = messages[condition];
			popupMessage = conditionMessages[Math.floor(Math.random() * conditionMessages.length)];
		} else {
			console.log("Invalid condition provided."); // Handle unexpected conditions
		}
	}

	function getValueRange(value) {
		if (value <= 100000) {
			return { min: 0, max: 100000 };
		} else if (value <= 500000) {
			return { min: 100000, max: 500000 };
		} else {
			return { min: 500000, max: 5000000 };
		}
	}

	// There are edge cases where things are... weird. Please fix.
	$effect(() => {
		// Makes blinkingLives switch between -1 and 2 on 2 lives
		// Using a separate variable to $lives because using it may cause issues.
		if ($lives === 2) {
			blinkingFlag = true;
			setInterval(() => {
				blinkingLives = blinkingLives === -1 ? 2 : -1; // Toggle between -1 and 2
			}, 1000);
		} else {
			blinkingFlag = false;
		}
	});

	$effect(() => {
		// Adjusts the lvies image do display the correct image
		if ($lives < 2) {
			livesImage = $lives;
		} else {
			livesImage = $lives - 1;
		}
	});

	onMount(async () => {
		await getAvailableIndex(); // Wait for availableIndex to be populated
		if (availableIndexArr.length > 0) {
			setCurrentQuestion(availableIndexArr[Math.floor(Math.random() * availableIndexArr.length)]);
		} else {
			console.error("Error availableIndexArr is empty or not initialized.");
		}
		lives.set(3);
		$gameRounds = [];
	});
</script>

<svelte:window
	onkeydown={() => {
		if (event.key === "Enter" && !resultPopup) submitButton.click();
		if (event.key === "Enter" && resultPopup) nextButton.click();
	}}
/>

<svelte:head>
	<title>Game</title>
</svelte:head>

<content class="flex w-full justify-center z-50">
	<!-- main view with car images and stats -->
	<div class="rounded-2xl w-full md:w-4/6 mx-2 max-md:mb-52">
		<div class="flex w-1/2 gap-2 ml-4">
			<Tab color={imageTab ? "var(--white)" : "var(--default-shadow)"} shadow={false} onclick={displayImages}>
				<span class="text-xl font-medium text-black">Images</span>
			</Tab>
			<Tab color={imageTab ? "var(--default-shadow)" : "var(--white)"} shadow={false} onclick={displayDescription}>
				<span class="text-xl font-medium text-black">About</span>
			</Tab>
		</div>
		<div class="flex flex-col w-full md:flex-row gap-5 min-h-[60dvh] md:max-h-[60dvh]">
			<div class="md:w-2/3 w-full drop-shadow-[0_0.5rem_0_var(--default-shadow)] basis-4/6">
				<Carousel images={question.images} description={question.description} {descriptionFlag} />
			</div>
			<div class="basis-2/6 min-w-64 overflow-auto drop-shadow-[0_0.5rem_0_var(--default-shadow)] rounded-2xl bg-white">
				<div class="w-full flex flex-col h-full gap-2 p-2 overflow-auto">
					{#each question.stats as stat}
						<Stat icon={stat.icon} text={stat.text} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</content>

<!-- Bottom UI -->
<div
	class="fixed bottom-0 margin-x-auto flex flex-row-reverse w-full justify-center md:gap-10 max-md:flex-wrap max-md:justify-start"
>
	<!-- Lives -->
	{#if livesImage || blinkingFlag}
		<div class="lives relative z-[5]">
			<img
				src="/assets/svg/traffic {blinkingFlag ? blinkingLives : livesImage}.svg"
				alt="lives"
				class="w-52 h-28 flex content-end"
			/>
		</div>
	{/if}
	<div class="p-2.5 rounded-t-2xl w-fit flex max-w-3xl z-[8]" style:background-color="var(--default-shadow)">
		<div class="flex grow gap-2.5 text-white">
			<PriceSlider sliderMin={range.min} sliderMax={range.max} bind:guessValue={guessResult} />
			<Button
				bind:this={submitButton}
				color="var(--default-button)"
				bgcolor="var(--default-button-dark)"
				buttonHeight="4.5rem"
				buttonWidth="5.5rem"
				onclick={showResult}
			>
				<span class="check-align-vertical">
					<Check strokeWidth={5} size={30} />
				</span>
			</Button>
		</div>
	</div>
</div>

<!-- Result Popups TODO: Make component -->
{#if resultPopup}
	<Popup title="" closeFunction={goToNextQuestion} showCloseButton={false}>
		{#if penaltyFlag || rewardFlag}
			<div in:fly|global={{ y: 50, delay: 1000 }} class="lives absolute z-[-1] right-0 -top-28">
				<img
					src="/assets/svg/traffic {blinkingFlag ? blinkingLives : livesImage}.svg"
					alt="lives"
					class="h-24 flex content-end"
				/>
			</div>
		{/if}
		<div class="h-full flex flex-col justify-evenly items-center">
			<div class="flex flex-col items-center">
				<p in:fly={{ y: -50, delay: 500 }} class="font-bold text-green text-7xl mb-5 text-center">
					{popupMessage}
				</p>
				<p class="text-black text-base text-center" in:fly={{ y: -50, delay: 500 }}>
					Your guess of <span class="text-orange font-semibold">${guessResult.toLocaleString()}</span>
					was
					<span class="text-orange font-semibold">{percentageDifference().toFixed(2)}% off.</span>
				</p>
				<div in:slide={{ delay: 1500 }} class="text-black text-base text-center flex">
					You get <span class="text-green font-semibold">&nbsp;{pointCalculation()} points.</span>
				</div>
			</div>
			<div class="w-full h-14 mt-14">
				<GuessDisplay
					answer={question.answer}
					guess={guessResult}
					percentageDifference={percentageDifference().toFixed(2)}
				/>
			</div>
			<div in:fly={{ x: -50, delay: 2500 }} class="mt-10">
				<Button bind:this={nextButton} buttonWidth="12rem" buttonHeight="4rem" onclick={goToNextQuestion}>
					<span class="text-white text-xl font-medium flex items-center justify-center gap-2"
						>Next <ArrowRightCircle strokeWidth={3} /></span
					>
				</Button>
			</div>
		</div>
	</Popup>
{/if}

<style>
	@media (max-width: 768px) {
		.lives img {
			height: 20vw; /* adjusts the size of the image */
			transform: translateY(25%);
		}
	}

	.check-align-vertical {
		margin-top: 3px;
	}
</style>
