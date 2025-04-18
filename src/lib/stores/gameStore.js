import { writable } from "svelte/store";

// Universal
export const gameVolume = writable(75);
export const music = writable(true);

export const difficulty = writable(1);
export const difficultyRules = writable({
	1: {
		correctTier: [10, 20],
	},
	2: {
		correctTier: [5, 10],
	},
	3: {
		correctTier: [1, 5],
	},
});

// Current game
export const gameRounds = writable([]);
export const lives = writable(4);
export const score = writable(0);
export const question = writable({});
export const guessResult = writable(0);
export const priceRange = writable({});
export const drawCardFlag = writable(false);

// Carousel
export const currentCarouselIndex = writable(0);
export const imgElement = writable();

// Car Data
export const totalCarAmount = writable(0);
