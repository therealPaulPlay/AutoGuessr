<script>
    import "../app.css";
    import Button from "$lib/components/Button.svelte";
    import Popup from "$lib/components/Popup.svelte";
    import { page } from "$app/stores";
    import { isAuthenticated, username } from "$lib/stores/accountStore";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import {
        settingsPopup,
        signupPopup,
        accountPopup,
    } from "$lib/stores/uiStore";
    import { checkAuthenticationStatus } from "$lib/utils/checkAuthStatus";
    import { User } from "lucide-svelte";
    import { onMount } from "svelte";
    import SignupPopup from "$lib/components/signupPopup.svelte";
    import AccountPopup from "$lib/components/AccountPopup.svelte";

    let { children } = $props();

    let leavePopup = $state(false);

    function HandleBackButton() {
        const leavePopupUrls = ["/game"]; // URLs to have confirmation before leaving
        if (leavePopupUrls.includes($page.url.pathname)) {
            leavePopup = true;
        } else {
            goto("/");
        }
    }

    // Authenticate
    onMount(() => {
        checkAuthenticationStatus();
    });
</script>

<nav
    class="fixed left-0 right-0 flex flex-row justify-between p-4 items-center z-40 color-mobile"
>
    <div>
        {#if $page.url.pathname != "/"}
            <button
                class="w-10 h-10 transition active:scale-90"
                onclick={HandleBackButton}
            >
                <img src="{base}/assets/svg/point arrow.svg" alt="Back" />
            </button>
        {/if}
    </div>
    <!-- Right side -->
    <div class="flex flex-row relative">
        <!-- Username/level -->
        <div
            class="mx-3 flex items-center rounded-lg mobile-user-area {$isAuthenticated
                ? 'bg-white mobile-user-area'
                : ''}"
        >
            {#if $isAuthenticated}
                <div class="p-3 flex items-center">
                    <button
                        class="flex items-center justify-center mr-4 transition hover:opacity-75
                ml-2"
                        onclick={() => {
                            accountPopup.set(true);
                        }}
                    >
                        <span class="text-xl z-10 text-white font-semibold"
                            ><User strokeWidth={2} /></span
                        >
                        <image
                            class="absolute w-9 h-9"
                            src="/assets/svg/level.svg"
                            alt="level"
                        ></image>
                    </button>
                    <div class="text-xl font-semibold">{$username}</div>
                </div>
            {:else}
                <Button
                    buttonWidth="8rem"
                    execFunction={() => {
                        signupPopup.set(true);
                    }}
                    ><span class="text-white text-xl font-medium">Sign up</span
                    ></Button
                >
            {/if}
        </div>
        <div class="flex flex-row items-center">
            <Button
                color="var(--default-button)"
                bgcolor="var(--default-button-dark)"
                shadowHeight="0.3rem"
                buttonHeight="3.25rem"
                buttonWidth="3.25rem"
                execFunction={() => settingsPopup.set(true)}
            >
                <img
                    src="/assets/svg/settings.svg"
                    alt="settings"
                    style:width="1.5rem"
                />
            </Button>
        </div>
    </div>
</nav>
<main class="custom-padding-top">
    {@render children?.()}
</main>

<!-- Universal Popups -->
{#if $settingsPopup}
    <Popup
        title="Settings"
        closeFunction={() => {
            settingsPopup.set(false);
        }}
    >
        <!-- Settings contents... -->
    </Popup>
{/if}

<!-- Leave confirmation -->
{#if leavePopup}
    <Popup title="" showCloseButton={false} small={true}>
        <div class="flex flex-col items-center h-full justify-evenly">
            <p
                class="text-black
                text-base
                text-center
                "
            >
                Are you sure you want to leave the game? <span
                    class="font-semibold">Any progress will be lost.</span
                >
            </p>
            <div class="flex gap-20">
                <Button
                    buttonHeight="4rem"
                    buttonWidth="7rem"
                    color="var(--default-button)"
                    bgcolor="var(--default-button-dark)"
                    execFunction={() => {
                        goto("/");
                        leavePopup = false;
                    }}
                >
                    <span
                        class="text-white
                        font-bold
                        text-2xl">Yes</span
                    >
                </Button>
                <Button
                    buttonHeight="4rem"
                    buttonWidth="7rem"
                    color="var(--green-button)"
                    bgcolor="var(--green-button-dark)"
                    execFunction={() => (leavePopup = false)}
                >
                    <span
                        class="text-white
                        font-bold
                        text-xl">No</span
                    >
                </Button>
            </div>
        </div>
    </Popup>
{/if}

<SignupPopup />
<AccountPopup />

<style>
    main {
        height: 100dvh;
    }

    .custom-padding-top {
        padding-top: calc(4rem + 7dvh);
    }

    @media (max-width: 800px) {
        .color-mobile {
            background-color: var(--white);
        }

        .mobile-user-area {
            background-color: var(--tan-light) !important;
        }
    }
</style>
