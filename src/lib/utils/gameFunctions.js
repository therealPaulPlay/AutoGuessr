import { get } from "svelte/store";
import { question, guessResult, lives, currentCarouselIndex, availableIndexArray, gameRounds } from "$lib/stores/gameStore";
import { resultPopup } from "$lib/stores/uiStore";
import { penaltyFlag, rewardFlag } from "$lib/stores/resultPopupStore";
import { fetchWithErrorHandling } from "$lib/utils/fetch";
import { baseUrl } from "$lib/stores/apiConfigStore";
import { displayError } from "$lib/utils/displayError";
import { milesToKilometers } from "$lib/utils/milesToKm";
import { goto } from "$app/navigation";

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

export function goToNextQuestion() {
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

    // Save round to localstorage
    let array = JSON.parse(localStorage.getItem("indexHistory")) || [];
    array.push(get(question).id);
    localStorage.setItem("indexHistory", JSON.stringify(array));

    // Update available indexes
    availableIndexArray.update((value) => {
        let newArray = value;
        newArray = removeCommonElements(newArray, array);
        return newArray;
    });

    const newIndex = Math.floor(Math.random() * get(availableIndexArray).length);
    setCurrentQuestion(get(availableIndexArray)[newIndex]);

    // Resets
    guessResult.set(0);
    rewardFlag.set(false);
    penaltyFlag.set(false);
    resultPopup.set(false);
    currentCarouselIndex.set(0);

    // Game over
    if (get(lives) <= 0) goto("/game/end");
}

export function percentageDifference() {
    if (get(question).answer === 0 && get(guessResult) === 0) return 0;
    const base = (Math.abs(get(question).answer) + Math.abs(get(guessResult))) / 2; // Calculate the base as the average of absolute values
    const difference = Math.abs(get(question).answer - get(guessResult)); // Calculate the absolute difference

    return (difference / base) * 100; // Calculate percentage
}

const MAX_POINTS = 500;

export function pointCalculation() {
    let difference = percentageDifference();
    if (difference > 100) return 0;
    return Math.round(((100 - difference) / 100) * MAX_POINTS);
}

// Remove elements that two arrays have in common and return array1
export function removeCommonElements(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) throw new Error("Both inputs must be arrays");
    const set2 = new Set(arr2);
    return arr1.filter((item) => !set2.has(item));
}