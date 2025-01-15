import { experience, isAuthenticated } from "$lib/stores/accountStore";
import { get } from "svelte/store";
import { fetchWithErrorHandling } from "./fetch";
import { displayError } from "./displayError";

export async function addExperience(addAmount) {

    if (!addAmount) {
        console.warn("Amount to add is zero or not defined.");
        return;
    }

    if (!get(isAuthenticated)) {
        console.warn("Aborting experience add - user not authenticated.")
        return;
    }

    try {
        const response = await fetchWithErrorHandling("https://accounts.openguessr.com/accounts/update/experience", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("bearer")}`
            },
            body: JSON.stringify({
                id: localStorage.getItem("id"),
                experience: Number(get(experience)) + Number(addAmount)
            })
        });

        const data = await response.json();
        if (data?.user?.experience) experience.set(data?.user?.experience);

    } catch (error) {
        console.error('Error occurred during experience update: ', error);
        displayError('Error occurred during experience update: ' + error);
    }
}