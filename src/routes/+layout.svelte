<script>
    import "../app.css";
    import Button from "$lib/components/Button.svelte";
    import Popup from "$lib/components/Popup.svelte";
    import { page } from "$app/stores";
    import { isAuthenticated, username } from "$lib/stores/accountStore";
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

<main>
    <nav class="flex flex-row justify-between p-8 items-center relative z-40">
        <div>
            {#if $page.url.pathname != "/"}
                <button class="w-10 h-10" onclick={() => (location.href = "/")}>
                    <img src="assets/svg/point arrow.svg" alt="Settings" />
                </button>
            {/if}
        </div>
        <!-- Right side -->
        <div class="flex flex-row relative">
            <!-- Username/level -->
            <div
                class="mx-3 flex items-center rounded-lg {$isAuthenticated
                    ? 'bg-white'
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
                        ><span class="text-white text-xl font-medium"
                            >Sign up</span
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
</style>
