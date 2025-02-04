import { cars } from "$lib/stores/carsStore";
import { get } from "svelte/store";

let carsList = get(cars);

function getRarity() {
  const rarity = Math.floor(Math.random() * 100) + 1;
  if (rarity <= 5) {
    return 'legendary';
  } else if (rarity <= 20) {
    return 'epic';
  } else if (rarity <= 50) {
    return 'rare';
  } else {
    return 'common';
  }
}

function getAllRarityCars(rarity) {
  return carsList.filter((car) => car.rarity === rarity);
}

function getRandomCar(rarity) {
  const cars = getAllRarityCars(rarity);
  return cars[Math.floor(Math.random() * cars.length)];
}

export function cardDraw() {
  const rarity = getRarity();
  return getRandomCar(rarity);
}