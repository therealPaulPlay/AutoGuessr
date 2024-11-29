<script>
    import Button from "../../lib/components/Button.svelte";
</script>

<main class="relative">
    <div class="flex flex-col w-full justify-center items-center">
        <div>
            <img src="/assets/svg/arrow.svg" alt="Arrow" class="w-8 h-8 -rotate-90" />
        </div>
        <div class="my-5 flex flex-row items-center">
            <img src="/assets/svg/legendary_back.svg" alt="Card" class="h-64" />
            <img src="/assets/svg/mystical_back.svg" alt="Card" class="h-96 z-10 -mx-10" />
            <img src="/assets/svg/epic_back.svg" alt="Card" class="h-64" />
        </div>
        <div>
            <img src="/assets/svg/arrow.svg" alt="Arrow" class="w-8 h-8 rotate-90 scale-y-[-1]" />
        </div>
        <div class="mt-5">
            <Button 
                buttonHeight=4rem
                buttonWidth=12rem
                shadowHeight=0.5rem
                execFunction={() => console.log("Roll button clicked")}
            >
                <span class="text-white font-bold text-4xl">Roll!</span>
            </Button>
        </div>
    </div>
</main>