import {
    errorPopup,
    errorText,
} from "$lib/stores/uiStore";

export function displayError(message) {
    errorText.set(message);
    errorPopup.set(true);
}