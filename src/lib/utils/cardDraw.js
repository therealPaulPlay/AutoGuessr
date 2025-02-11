import { get } from "svelte/store";
import { getCardCarList } from "./getCardCarList";
import { score } from "$lib/stores/gameStore";

export function calculateRarity(bonus) {
	const cappedBonus = Math.min(Math.max(bonus, 0), 100);
	const scalingFactor = cappedBonus / 100;

	const baseProbs = {
		common: 50,
		rare: 25,
		epic: 15,
		legendary: 8,
		mystical: 2,
	};

	const adjustedProbs = {
		common: baseProbs.common * (1 - scalingFactor * 0.8),
		rare: baseProbs.rare * (1 - scalingFactor * 0.5),
		epic: baseProbs.epic * (1 + scalingFactor),
		legendary: baseProbs.legendary * (1 + scalingFactor * 2),
		mystical: baseProbs.mystical * (1 + scalingFactor * 3),
	};

	const thresholds = {
		common: adjustedProbs.common,
		rare: adjustedProbs.common + adjustedProbs.rare,
		epic: adjustedProbs.common + adjustedProbs.rare + adjustedProbs.epic,
		legendary: adjustedProbs.common + adjustedProbs.rare + adjustedProbs.epic + adjustedProbs.legendary,
		mystical: 100,
	};

	const number = Math.floor(Math.random() * 100);

	if (number < thresholds.common) {
		return "common";
	} else if (number < thresholds.rare) {
		return "rare";
	} else if (number < thresholds.epic) {
		return "epic";
	} else if (number < thresholds.legendary) {
		return "legendary";
	} else {
		return "mystical";
	}
}

async function getAllRarityCars(rarity) {
	const list = await getCardCarList();
	return list.filter((car) => car.rarity === rarity);
}

async function getRandomCar(rarity) {
	const cars = await getAllRarityCars(rarity);
	return cars[Math.floor(Math.random() * cars.length)];
}

export async function cardDraw() {
	const rarity = calculateRarity(get(score));
	const randomCar = await getRandomCar(rarity);
	return randomCar;
}
