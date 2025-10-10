import { isAuthenticated, username, experience } from "$lib/stores/accountStore";
import { accountUrl } from "$lib/stores/apiConfigStore";
import { fetchWithErrorHandling } from "./fetch";
import { get } from "svelte/store";
import { getSave } from "./saveHelper";

async function getUser() {
    try {
        const response = await fetchWithErrorHandling(
            `${get(accountUrl)}/accounts/user/${localStorage.getItem("id") || "-1"}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("bearer")}`,
                },
            },
        );

        const data = await response.json();
        return data?.user;
    } catch (error) {
        console.error("Error occurred while fetching the user: ", error);
    }
};

// Global function that changes everything to logged in or signed out (all other sign-in functions are related to this)
export async function checkAuthenticationStatus() {
    let bearerToken = localStorage.getItem("bearer");

    if (bearerToken && localStorage.getItem("id") && !isTokenExpired(bearerToken)) {
        // Set store data
        isAuthenticated.set(true);
        const user = await getUser(); // Load user details

        if (user) {
            experience.set(user?.experience);
            username.set(user?.username);
        }
    } else {
        isAuthenticated.set(false);
    }

    getSave(); // Load user save
}

export function signOut() {
    localStorage.removeItem("id");
    localStorage.removeItem("bearer");
    username.set("Guest");
    experience.set(0);
    isAuthenticated.set(false);
}

function isTokenExpired(token) {
    let expired;
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(""),
        );

        const { exp } = JSON.parse(jsonPayload);
        expired = Date.now() >= exp * 1000;
    } catch {
        expired = true; // If the token cannot be parsed, it will be counted as expired
    }
    if (expired) signOut();
    return expired;
}