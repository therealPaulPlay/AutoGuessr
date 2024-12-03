<script>
    import "../app.css";
    import { page } from "$app/stores";
    import Button from "$lib/components/Button.svelte";
    import { isAuthenticated } from "$lib/stores/accountStore";

    let { children } = $props();
</script>

<main>
    <nav class="flex flex-row justify-between p-8 items-center relative z-50">
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
            <div class="mx-3 flex items-center rounded-lg {$isAuthenticated ? "bg-white" : ""}">
                {#if $isAuthenticated}
                    <div class="p-3 flex items-center">
                        <div
                            class="flex flex-col items-center justify-center mr-4
                    ml-2">
                            <span class="text-xl z-10 text-white font-semibold"
                                >13</span>
                            <image
                                class="absolute w-9 h-9"
                                src="assets/svg/level.svg"
                                alt="level"></image>
                        </div>
                        <div class="text-xl font-semibold">Username</div>
                    </div>
                {:else}
                    <Button buttonWidth="8rem" border={true} bgcolor="var(--white)"
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
                    execFunction={() => console.log("Settings button pressed")}>
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

<style>
    main {
        height: 100dvh;
    }
</style>
