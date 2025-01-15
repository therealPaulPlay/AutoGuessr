import { writable } from "svelte/store";

// Universal
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

// Carousel
export const currentCarouselIndex = writable(0);

// Car Data
export const totalCarAmount = writable(0);