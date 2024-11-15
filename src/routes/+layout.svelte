<script>
    import "../app.css";
    import Button from '../lib/components/Button.svelte';

    let { children } = $props();
</script>

<main>
    <nav class="flex flex-row justify-between p-8 items-center">
        <div>
            <button class="w-10 h-10">
                <img src="assets/svg/point arrow.svg" alt="Back arrow"/>
            </button>
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
                    imageSize=1.5rem
                    shadowHeight=0.3rem
                    svg="assets/svg/settings.svg"
                />
            </div>
        </div>
    </nav>
    {@render children?.()}
</main>