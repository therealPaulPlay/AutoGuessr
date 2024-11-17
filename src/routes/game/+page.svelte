<script>
    import Carousel from "../../lib/components/Carousel.svelte";
    import Tab from "../../lib/components/Tab.svelte";
    import Stat from "../../lib/components/Stat.svelte";
    import PriceSlider from "../../lib/components/PriceSlider.svelte";
    import Button from "../../lib/components/Button.svelte";

    let stats = [
        {
            icon: "/assets/svg/horsepower.svg",
            text: "Name here, no?",
        },
        {
            icon: "/assets/svg/horsepower.svg",
            text: "237.0HP",
        },
        {
            icon: "/assets/svg/transmission.svg",
            text: "Automatic",
        },
        {
            icon: "/assets/svg/date.svg",
            text: "2017",
        },
        {
            icon: "/assets/svg/owner.svg",
            text: "2",
        },
        {
            icon: "/assets/svg/fuel.svg",
            text: "Gasoline",
        },
    ];
</script>

<main class="flex flex-col items-center">
    <!-- Main game content -->
    <div class="flex justify-center w-full">
        <!-- main window -->
        <div class="bg-tanLight border-white border-8 rounded-2xl w-4/5 p-12">
            <div class="flex flex-row w-1/3 gap-4">
                <Tab color="var(--default-button)" onHover={false}>
                    <span class="text-2xl font-medium">Images</span>
                </Tab>
                <Tab color="var(--default-button)" onHover={false}>
                    <span class="text-2xl font-medium">Desc.</span>
                </Tab>
            </div>
            <div class="flex flex-row gap-4 drop-shadow-[0_0.5rem_0_rgba(231,_101,_49,_0.15)]">
                <div class="w-2/3">
                    <Carousel />
                </div>
                <div class="w-1/3 flex flex-col justify-between pr-10">
                    {#each stats as stat}
                        <Stat icon={stat.icon} text={stat.text} />
                    {/each}
                </div>
            </div>
        </div>
    </div>
    <!-- Guessing part -->
    <div class="mt-10 p-3 pb-4 rounded-t-xl bg-orange/10">
        <div class="flex flex-row">
            <PriceSlider min="0" max="10" />
            <div class="ml-2">
                <Button
                color="var(--default-button)"
                bgcolor="var(--default-button-dark)"
                shadowHeight="0.3rem"
                buttonHeight="4.5rem"
                buttonWidth="5.5rem"
                execFunction={() => console.log("Guessed!")}
            >
                <img
                    src="/assets/svg/check mark.svg"
                    alt="guess icon"
                    style:width="60%"
                />
            </Button>
            </div>
        </div>
    </div>
</main>
