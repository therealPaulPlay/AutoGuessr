<script>
    import Carousel from "$lib/components/Carousel.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import Stat from "$lib/components/Stat.svelte";
    import PriceSlider from "$lib/components/PriceSlider.svelte";
    import Button from "$lib/components/Button.svelte";

    let images = [
        "/assets/img/example/img1.jpeg",
        "/assets/img/example/img2.jpeg",
        "/assets/img/example/img3.jpeg",
        "/assets/img/example/img4.jpeg",
        "/assets/img/example/img5.jpeg",
        "/assets/img/example/img6.jpeg",
        "/assets/img/example/img7.jpeg",
        "/assets/img/example/img8.jpeg",
        "/assets/img/example/img9.png",
    ];

    let stats = [
        {
            icon: "/assets/svg/horsepower.svg",
            text: "Name of the car",
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

    let description =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc";

    let imageTab = $state(true);
    let descriptionFlag = $state(false);
    let lives = $state(2); // 0 to 3

    function displayImages() {
        console.log("Images");
        imageTab = true;
        descriptionFlag = false;
    }

    function displayDescription() {
        console.log("Description");
        imageTab = false;
        descriptionFlag = true;
    }
</script>

<main class="flex flex-col items-center relative">
    <!-- Main game content -->
    <div class="flex justify-center w-full">
        <!-- main window -->
        <div class="rounded-2xl w-4/5 px-12">
            <div class="flex w-1/2 gap-2 ml-4">
                <Tab
                    color={imageTab ? "var(--white)" : "var(--default-shadow)"}
                    onHover={false}
                    shadow={false}
                    execFunction={displayImages}>
                    <span class="text-xl font-medium text-black">Images</span>
                </Tab>
                <Tab
                    color={imageTab ? "var(--default-shadow)" : "var(--white)"}
                    onHover={false}
                    shadow={false}
                    execFunction={displayDescription}>
                    <span class="text-xl font-medium text-black"
                        >Description</span>
                </Tab>
            </div>
            <div
                class="flex gap-5 drop-shadow-[0_0.5rem_0_var(--default-shadow)]">
                <div class="w-2/3">
                    <Carousel {images} {description} {descriptionFlag} />
                </div>
                <div class="w-1/3 rounded-xl bg-white overflow-auto">
                    <div class="w-full mb-auto flex flex-col justify-between h-fit gap-5 p-2">
                        {#each stats as stat}
                            <Stat icon={stat.icon} text={stat.text} />
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Bottom UI -->
    <div class="fixed bottom-0 margin-x-auto flex gap-10 w-full justify-center">
        <div
            class="p-2.5 rounded-t-2xl w-1/2 flex max-w-3xl"
            style:background-color="var(--default-shadow)">
            <div class="flex grow gap-1">
                <PriceSlider min="0" max="10" />
                <div class="ml-2">
                    <Button
                        color="var(--default-button)"
                        bgcolor="var(--default-button-dark)"
                        shadowHeight="0.3rem"
                        buttonHeight="4.5rem"
                        buttonWidth="5.5rem"
                        execFunction={() => console.log("Guessed!")}>
                        <img
                            src="/assets/svg/check mark.svg"
                            alt="guess icon"
                            style:width="60%" />
                    </Button>
                </div>
            </div>
        </div>
        <!-- Lives -->
        <!-- TODO: Make "disabled" variants darker AND make sure that the traffic lights themselves are centered with the buttons (so anchored to top!) -->
        <div class="h-full -z-10">
            <img
                src="/assets/svg/traffic {lives}.svg"
                alt="lives"
                class="w-52 h-28" />
        </div>
    </div>
</main>
