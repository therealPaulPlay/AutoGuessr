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
        penaltyThreshold: 10, // Only applies for difficulty 3
    },
});

// Current game
export const gameRounds = writable([]);
export const lives = writable(3);
export const score = writable(0);
export const question = writable({});
export const guessResult = writable(0);
export const availableIndexArray = writable([]);

// Carousel
export const currentCarouselIndex = writable(0);