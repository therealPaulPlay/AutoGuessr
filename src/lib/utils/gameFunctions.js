import { get } from "svelte/store";
import { question, guessResult, lives, currentCarouselIndex, gameRounds, totalCarAmount, score, imgElement, drawCardFlag } from "$lib/stores/gameStore";
import { resultPopup } from "$lib/stores/uiStore";
import { penaltyFlag, rewardFlag } from "$lib/stores/resultPopupStore";
import { fetchWithErrorHandling } from "$lib/utils/fetch";
import { displayError } from "$lib/utils/displayError";
import { milesToKilometers } from "$lib/utils/milesToKm";
import { baseUrl } from "$lib/stores/apiConfigStore";
import { goto } from "$app/navigation";
import { addExperience } from "./addExp";
import { isAuthenticated, highscore, experience } from "$lib/stores/accountStore";

let SCORE_THRESHOLD = 5;

export async function setCurrentQuestion(questionId) {
    try {
        const data = await fetchWithErrorHandling(`${get(baseUrl)}/car-data/standard/${questionId}`).then((response) =>
            response.json(),
        );

        get(question).id = questionId;
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
    } catch (error) {
        console.error("Error occured retrieving car data:", error);
        displayError("Error occured retrieving car data: " + error);
    }
}

export function goToNextQuestion(saveHistory = true) {
    if (saveHistory) addLastQuestionToHistory();

    // Resets
    guessResult.set(0);
    rewardFlag.set(false);
    penaltyFlag.set(false);
    resultPopup.set(false);
    currentCarouselIndex.set(0);
    const img = get(imgElement);
    if (img) img.src = "";

    // Game over
    if (get(lives) <= SCORE_THRESHOLD) {
        highscore.update((value) => {
            if (get(score) > value) return get(score);
            return value;
        });

        if (get(score) >= SCORE_THRESHOLD) {
            drawCardFlag.set(true);
            goto("/card-draw");
        }
        else {
            goto("/game/end");
        }
        return;
    }

    const history = JSON.parse(localStorage.getItem("indexHistory")) || [];

    // Ensure history isn't bigger than available car amount
    if (get(totalCarAmount) < history.length - 200) {
        console.warn("Index history is too long, or total car amount to small. Resetting history.");
        localStorage.setItem("indexHistory", JSON.stringify([]));
    }

    // Find a new index (that isn't in the history)
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * get(totalCarAmount));
    } while (history.includes(newIndex));

    setCurrentQuestion(newIndex); // Fetch new car question
}

function addLastQuestionToHistory() {
    gameRounds.update((value) => {
        const newArray = value;
        newArray.push({
            id: get(question).id,
            guess: get(guessResult),
            answer: get(question).answer,
            difference: percentageDifference(),
            points: pointCalculation(),
            rewardFlag: get(rewardFlag),
            penaltyFlag: get(penaltyFlag)
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
    if (addXP == true && get(isAuthenticated) && points) addExperience(points)

    return points;
}

export async function getTotalCarDataAmount() {
    try {
        const response = await fetchWithErrorHandling(`${get(baseUrl)}/car-data/amount`);
        const data = await response.json();
        return data?.total;
    } catch (error) {
        console.error("Error occured getting the available car dataset size:", error);
        displayError("Error occured getting the available car dataset size: " + error);
    }
}