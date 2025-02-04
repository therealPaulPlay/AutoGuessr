import { userCars } from "$lib/stores/accountStore";

export function saveAutocard(card) {
    let autocards = JSON.parse(localStorage.getItem("autocards")) || [];

    if (!Array.isArray(autocards)) {
        autocards = [];
    }

    const cardString = JSON.stringify(card);

    // Check if an identical card already exists
    const exists = autocards.some(existingCard => JSON.stringify(existingCard) === cardString);

    if (!exists) {
        autocards.push(card);
        localStorage.setItem("autocards", JSON.stringify(autocards));
        return true;
    } else {
        return false;
    }
}


export function updateAutocardsList() {
    let autocards = JSON.parse(localStorage.getItem("autocards")) || [];
    userCars.set(autocards);
}