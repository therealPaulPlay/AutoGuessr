import { userCards } from "$lib/stores/accountStore";
import { get } from "svelte/store";
import { saveStorage } from "./saveHelper";

export function saveAutocard(card) {
    const cardString = JSON.stringify(card);
    const exists = get(userCards).some(existingCard => JSON.stringify(existingCard) === cardString); // Check if an identical card already exists

    if (!exists) {
        get(userCards).push(card);
        saveStorage();
    }

    return !exists;
}