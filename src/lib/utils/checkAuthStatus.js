import { isAuthenticated, username, experience } from "$lib/stores/accountStore";
import { fetchWithErrorHandling } from "./fetch";

async function getUser() {
    try {
        const response = await fetchWithErrorHandling(
            `https://accounts.openguessr.com/accounts/user/${localStorage.getItem("id") || "-1"}`,
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
            username.set(user?.userName);
        }
    } else {
        isAuthenticated.set(false);
    }
}

export function signOut() {
    localStorage.removeItem("id");
    localStorage.removeItem("bearer");
    username.set("Guest");
    experience.set(0);
    isAuthenticated.set(false);
}

function isTokenExpired(token) {
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


    // If the token cannot be parsed, it is invalid and will be counted as expired
    try {
        const { exp } = JSON.parse(jsonPayload);
        const expired = Date.now() >= exp * 1000;
        return expired;
    } catch {
        expired = false;
        return expired;
    }
}