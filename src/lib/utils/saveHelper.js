import { highscore, userCards } from "$lib/stores/storageStore";
import { get } from "svelte/store";

export async function saveStorage() {
    const storageObject = {
        highscore: get(highscore) || 0,
        userCards: get(userCards) || []
    }

    // Check for differences and save
    try {
        if (JSON.stringify(storageObject) == localStorage.getItem("autoguessr_save")) return; // Return if no changes
        localStorage.setItem("autoguessr_save", JSON.stringify(storageObject));
    } catch (error) {
        console.error("Error occured stringifying autoguessr save:", error);
    }
}

export async function getSave() {
    let storageSave = localStorage.getItem("autoguessr_save");
    if (!storageSave) return;

    try {
        storageSave = JSON.parse(storageSave);
    } catch (error) {
        console.error("Error occured parsing local save:", error);
    }

    highscore.set(storageSave?.highscore || 0);
    userCards.set(storageSave?.userCards || []);
}