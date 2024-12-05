<script>
    import { onMount } from "svelte";
    import Popup from "./Popup.svelte";
    import { signupPopup } from "$lib/stores/uiStore";
    import { checkAuthenticationStatus } from "$lib/utils/checkAuthStatus";

    onMount(() => {
        // Iframe messages
        window.onmessage = function (e) {
            try {
                const data = String(e.data); // Ensure data is a string

                switch (true) {
                    case data === "close":
                        signupPopup.set(false);
                        break;
                    case data.includes("token"):
                        localStorage.setItem(
                            "bearer",
                            data.replace("token ", ""),
                        );
                        break;
                    case data.includes("id"):
                        localStorage.setItem("id", data.replace("id ", ""));
                        break;
                    case data == "loadAccountStatus":
                        setTimeout(() => {
                            checkAuthenticationStatus();
                        }, 200);
                        break;
                }
            } catch (error) {
                console.error("Error processing window message: " + error);
            }
        };
    });
</script>

{#if $signupPopup}
    <Popup
        closeFunction={() => {
            signupPopup.set(false);
        }}
        minimalPadding={true}
        tall={true}>
        <iframe
            src="https://openguessr.com/signup"
            closeFunction={() => {
                signupPopup.set(false);
            }}
            title="Login and Sign up"
            class="iframe-size rounded-lg"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
    </Popup>
{/if}

<style>
    .iframe-size {
        width: 100%;
        height: calc(100% - 2rem);
        margin-top: 1.5rem;
    }
</style>
