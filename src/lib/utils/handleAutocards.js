import { userCards } from "$lib/stores/accountStore";
import { get } from "svelte/store";
import { saveStorage } from "./saveHelper";

export function saveAutocard(cardId) {
    const exists = get(userCards).some(existingId => existingId === cardId); // Check if ID already exists

    if (!exists) {
        get(userCards).push(cardId); // Store only the ID
        saveStorage();
    }

    return !exists;
}