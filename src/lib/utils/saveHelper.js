import { highscore, isAuthenticated, userCards } from "$lib/stores/accountStore";
import { browser } from "$app/environment";
import { get } from "svelte/store";
import { storage } from "three/tsl";
import { fetchWithErrorHandling } from "./fetch";
import { displayError } from "./displayError";

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

    // Save to database
    if (get(isAuthenticated) && localStorage.getItem("id") != null) {
        try {
            const response = await fetchWithErrorHandling("https://accounts.openguessr.com/autoguessr/save", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("bearer")}`
                },
                body: JSON.stringify({
                    id: localStorage.getItem("id"),
                    save: storageObject
                })
            });

        } catch (error) {
            console.error('Error occurred during storage save:', error);
            displayError('Error occurred during storage save: ' + error);
        }
    }
}

export async function getSave() {
    if (get(isAuthenticated) && localStorage.getItem("id") != null) {
        try {
            const response = await fetchWithErrorHandling("https://accounts.openguessr.com/autoguessr/get-save/" + localStorage.getItem("id"));
            const data = await response.json();
            highscore.set(data?.highscore || 0);
            userCards.set(data?.userCards || []);
        } catch (error) {
            console.error('Error occurred getting save:', error);
            displayError('Error occurred getting save: ' + error);
            getLocalSave();
        }
    } else {
        getLocalSave();
    }
}

function getLocalSave() {
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