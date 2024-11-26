<script>
    import "../app.css";
    import { page } from "$app/stores";
    import Button from '../lib/components/Button.svelte';

    let { children } = $props();

</script>

<main>
    <nav class="flex flex-row justify-between p-8 items-center relative z-50">
        <div>
            {#if $page.url.pathname != "/"}
            <button class="w-10 h-10" onclick={() => location.href = "/"}>
                <img src="assets/svg/point arrow.svg" alt="Settings"/>
            </button>
            {/if}
        </div>
        <!-- Right side -->
        <div class="flex flex-row relative">
            <!-- Username/level -->
            <div class="mx-3 flex items-center bg-white p-3 rounded-lg">
                <button class="flex flex-col items-center justify-center mr-4 ml-2">
                    <span class="text-xl z-10 text-white font-semibold">13</span>
                    <image class="absolute w-9 h-9" src="assets/svg/level.svg" alt="level"/>
                </button>
                <div class="text-xl font-semibold">
                    Username
                </div>
            </div>
            <div class="flex flex-row items-center">
                <Button 
                    color="var(--default-button)" 
                    bgcolor="var(--default-button-dark)" 
                    shadowHeight=0.3rem
                    buttonHeight=3.25rem
                    buttonWidth=3.25rem
                    execFunction={() => console.log("Settings button pressed")}
                >
                <img src="/assets/svg/settings.svg" alt="settings" style:width="1.5rem" />
                </Button>
            </div>
        </div>
    </nav>
    {@render children?.()}
</main>