<script>
    import "../app.css";
    import Button from "$lib/components/Button.svelte";
    import Popup from "$lib/components/Popup.svelte";
    import { page } from "$app/stores";
    import { isAuthenticated, username } from "$lib/stores/accountStore";
    import { goto } from "$app/navigation";
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

    // Authenticate
    onMount(() => {
        checkAuthenticationStatus();
    });
</script>

<nav
    class="fixed left-0 right-0 flex flex-row justify-between p-4 items-center z-40 color-mobile">
    <div>
        {#if $page.url.pathname != "/"}
            <button class="w-10 h-10 transition active:scale-90" onclick={() => goto("/")}>
                <img src="assets/svg/point arrow.svg" alt="Settings" />
            </button>
        {/if}
    </div>
    <!-- Right side -->
    <div class="flex flex-row relative">
        <!-- Username/level -->
        <div
            class="mx-3 flex items-center rounded-lg mobile-user-area {$isAuthenticated
                ? 'bg-white mobile-user-area'
                : ''}">
            {#if $isAuthenticated}
                <div class="p-3 flex items-center">
                    <button
                        class="flex items-center justify-center mr-4 transition hover:opacity-75
                ml-2"
                        onclick={() => {
                            accountPopup.set(true);
                        }}>
                        <span class="text-xl z-10 text-white font-semibold"
                            ><User strokeWidth={2} /></span>
                        <image
                            class="absolute w-9 h-9"
                            src="assets/svg/level.svg"
                            alt="level"></image>
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
                    ></Button>
            {/if}
        </div>
        <div class="flex flex-row items-center">
            <Button
                color="var(--default-button)"
                bgcolor="var(--default-button-dark)"
                shadowHeight="0.3rem"
                buttonHeight="3.25rem"
                buttonWidth="3.25rem"
                execFunction={() => settingsPopup.set(true)}>
                <img
                    src="/assets/svg/settings.svg"
                    alt="settings"
                    style:width="1.5rem" />
            </Button>
        </div>
    </div>
</nav>
<main class="pt-32">
    {@render children?.()}
</main>

<!-- Universal Popups -->
{#if $settingsPopup}
    <Popup
        title="Settings"
        closeFunction={() => {
            settingsPopup.set(false);
        }}>
        <!-- Settings contents... -->
    </Popup>
{/if}

<SignupPopup />
<AccountPopup />

<style>
    main {
        height: 100dvh;
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
