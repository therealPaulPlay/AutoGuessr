import { get } from "svelte/store";
import {
	question,
	guessResult,
	lives,
	currentCarouselIndex,
	gameRounds,
	totalCarAmount,
	score,
	imgElement,
	drawCardFlag,
	priceRange,
} from "$lib/stores/gameStore";
import { resultPopup } from "$lib/stores/uiStore";
import { penaltyFlag, rewardFlag } from "$lib/stores/resultPopupStore";
import { fetchWithErrorHandling } from "$lib/utils/fetch";
import { displayError } from "$lib/utils/displayError";
import { milesToKilometers } from "$lib/utils/milesToKm";
import { baseUrl } from "$lib/stores/apiConfigStore";
import { goto } from "$app/navigation";
import { addExperience } from "./addExp";
import { isAuthenticated, highscore, experience } from "$lib/stores/accountStore";
import { saveStorage } from "./saveHelper";
import { inGame, multiplayerFlag, multiplayerQuestionsList, peer } from "$lib/stores/multiplayerStore";
import { getPlayerInfo, updatePlayerInGame, updatePlayerRound, updatePlayerScore } from "./multiplayer";

async function setCurrentQuestion(questionIndex) {
	try {
		let data;

		try {
			data = await fetchWithErrorHandling(`${get(baseUrl)}/car-data/standard/${questionIndex}`).then((response) =>
				response.json(),
			);
		} catch (error) {
			console.error("Error fetching car data:", error);
			displayError("Loading backup car, as fetching car data failed: " + error);

			const backupCarsUnparsed = await fetch("/json/backup_cars_250.json");
			const backupCars = await backupCarsUnparsed.json();
			if (questionIndex > 250) questionIndex = Math.floor(Math.random() * 250); // If the index is too large, get new random one
			data = backupCars[questionIndex];
		}

		get(question).id = questionIndex;
		get(question).answer = data.price;
		get(question).images = data.photos;
		get(question).description = {};
		get(question).description.text = data.description;
		get(question).description.coordinates = data.coordinates;
		get(question).description.vendorURL = data.vendorURL;

		// Populate stats array
		get(question).stats = [
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

		question.set(get(question)); // Ensure reactivity update for store
		priceRange.set(getValueRange(get(question).answer)); // Set range
		guessResult.set(get(priceRange).min); // Reset price slider value to new minimum
	} catch (error) {
		console.error("Error occured loading new question:", error);
	}
}

function getValueRange(value) {
	if (value <= 100_000) return { min: 0, max: 100_000 };
	if (value <= 500_000) return { min: 100_000, max: 500_000 };
	return { min: 500_000, max: 5_000_000 };
}

const SCORE_DRAW_THRESHOLD = 5;

export function goToNextQuestion(saveHistory = true) {
	if (saveHistory) addLastQuestionToRoundLog();

	// Resets
	guessResult.set(0);
	rewardFlag.set(false);
	penaltyFlag.set(false);
	resultPopup.set(false);
	currentCarouselIndex.set(0);
	const img = get(imgElement);
	if (img) img.src = "";

	// Game over
	if (get(lives) <= 1) {
		if (get(score) > get(highscore)) {
			highscore.set(get(score));
			saveStorage();
		}

		if (get(score) >= SCORE_DRAW_THRESHOLD) {
			drawCardFlag.set(true);
			goto("/card-draw");
			return;
		}

		if (get(multiplayerFlag)) {
			updatePlayerInGame(get(peer).id, false);
		}

		goto("/game/end");
		return;
	}

	const history = JSON.parse(localStorage.getItem("indexHistory")) || [];

	// Ensure history isn't bigger than available car amount
	if (get(totalCarAmount) < history.length - 200) {
		console.warn("Index history is too long, or total car amount to small. Resetting history.");
		localStorage.setItem("indexHistory", JSON.stringify([]));
	}

	// Logic if player in a multiplayer game
	if (get(multiplayerFlag)) {
		let currentRound = getPlayerInfo(get(peer)?.id)?.round;
		updatePlayerRound(get(peer)?.id, currentRound + 1);

		let newQuestionIndex = get(peer)?.getStorage?.questionsIds[currentRound];
		setCurrentQuestion(newQuestionIndex);
		return;
	}

	// Find a new index (that isn't in the history)
	let newIndex;
	do {
		newIndex = Math.floor(Math.random() * get(totalCarAmount));
	} while (history.includes(newIndex));

	setCurrentQuestion(newIndex); // Fetch new car question
}

function addLastQuestionToRoundLog() {
	gameRounds.update((value) => {
		const newArray = value;
		newArray.push({
			id: get(question).id,
			guess: get(guessResult),
			answer: get(question).answer,
			difference: percentageDifference(),
			points: pointCalculation(),
			rewardFlag: get(rewardFlag),
			penaltyFlag: get(penaltyFlag),
		});
		return newArray;
	});

	// Get Index History
	let history = JSON.parse(localStorage.getItem("indexHistory")) || [];

	// Add old question index at the front of the history
	history.unshift(get(question).id);
	if (history.length > Math.floor(get(totalCarAmount) * 0.75)) history.pop(); // Remove last history entry if the history is almost as long as the amount of available cars
	localStorage.setItem("indexHistory", JSON.stringify(history));
}

// Get percentage difference between guess & actual price
export function percentageDifference() {
	if (get(guessResult) < get(priceRange)?.min) guessResult.set(get(priceRange)?.min); // Ensure guess is within range
	if (get(guessResult) > get(priceRange).max) guessResult.set(get(priceRange)?.max); // Probably not needed, but just in case
	if (get(question).answer === 0 && get(guessResult) === 0) return 0;
	const base = (Math.abs(get(question).answer) + Math.abs(get(guessResult))) / 2; // Calculate the base as the average of absolute values
	const difference = Math.abs(get(question).answer - get(guessResult)); // Calculate the absolute difference

	return (difference / base) * 100; // Calculate percentage
}

const MAX_POINTS = 500;

// Calculate points and optionally add them as XP
export function pointCalculation(addXP = false) {
	let points;
	let difference = percentageDifference();

	if (difference > 100) {
		points = 0;
	} else {
		points = Math.round(((100 - difference) / 100) * MAX_POINTS);
	}

	// Add experience if authenticated + addXP + points !== 0
	if (addXP == true && get(isAuthenticated) && points) addExperience(points);

	return points;
}

export async function getTotalCarDataAmount() {
	try {
		const response = await fetchWithErrorHandling(`${get(baseUrl)}/car-data/amount`);
		const data = await response.json();
		return data?.total;
	} catch (error) {
		console.error("Error occured fetching the available car amount:", error);
		return 250; // Return backup size
	}
}
