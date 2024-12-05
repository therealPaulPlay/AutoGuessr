import { experience, isAuthenticated } from "$lib/stores/accountStore";
import { get } from "svelte/store";

export async function addExperience(addAmount) {

    if (!addAmount) {
        console.warn("Amount to add is zero or not defined.");
        return;
    }

    if (get(isAuthenticated)) {
        console.warn("Aborting experience add - user not authenticated.")
        return;
    }

    try {
        const requestBody = {
            id: localStorage.getItem("id"),
            experience: Number(get(experience)) + Number(addAmount)
        };

        const experienceEndpoint = "https://accounts.openguessr.com/accounts/update/experience";

        // Make the PUT request using Fetch API
        const response = await fetch(experienceEndpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("bearer")}`
            },
            body: JSON.stringify(requestBody)
        });

        // Check if the response is successful
        if (response.ok) {
            const data = await response.json();
            if (data?.user?.experience) experience.set(data?.user?.experience);

        } else {
            console.error('Experience update failed, Status: ' + response.status + ", Error " + response?.error);
        }
    } catch (error) {
        console.error('Error occurred during experience update: ', error);
    }
}