import { get } from "svelte/store";
import { getCardCarList } from "./getCardCarList";

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

async function getAllRarityCars(rarity) {
  const list = await getCardCarList();
  return list.filter((car) => car.rarity === rarity);
}

async function getRandomCar(rarity) {
  const cars = await getAllRarityCars(rarity);
  return cars[Math.floor(Math.random() * cars.length)];
}

export async function cardDraw() {
  const rarity = getRarity();
  const randomCar = await getRandomCar(rarity);
  return randomCar;
}