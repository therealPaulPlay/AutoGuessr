<script>
    import Carousel from "$lib/components/Carousel.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import Stat from "$lib/components/Stat.svelte";
    import PriceSlider from "$lib/components/PriceSlider.svelte";
    import Button from "$lib/components/Button.svelte";
    import Popup from "$lib/components/Popup.svelte";
    import { Check } from "lucide-svelte";
    import { fly, slide } from "svelte/transition";

    let question = {
        answer: 35000,
        description:
            "What does the buzzword 'technologies' really mean? Think virally-distributed. Quick: do you have a plan to become cross-media? We think that most co-branded splash pages use far too much Perl, and not enough OWL. Without niches, you will lack experiences. The capability to implement wirelessly leads to the ability to iterate virtually. Without preplanned cyber-Total Quality Control, aggregation are forced to become cross-media? We think that most C2C2C web-based applications use far too much Rails, and not enough PNG. Is it more important for something to be best-of-breed? The portals factor can be delivered as-a-service to wherever it’s intended to go – mobile. Our infinitely reconfigurable feature set is unmatched in the industry, but our back-end performance and non-complex use is invariably considered a remarkable achievement. It sounds wonderful, but it's 100 percent accurate! The experiences factor is 1000/60/60/24/7/365. Do you have a infinitely reconfigurable feature set is unparalleled, but our vertical, customized efficient, user-centric TQM and non-complex use is usually considered an amazing achievement. Do you have a infinitely reconfigurable scheme for coping with emerging methodologies? Is it more important for something to be customer-directed? What does the term 'dot-com' really mean? Helping marketers serve unmatched cross-phase personalized experiences at every step of the pudding is in the industry, but our C2C2C paradigms and easy configuration is usually considered an amazing achievement",
        images: [
            "/assets/img/example/img1.jpeg",
            "/assets/img/example/img2.jpeg",
            "/assets/img/example/img3.jpeg",
            "/assets/img/example/img4.jpeg",
            "/assets/img/example/img5.jpeg",
            "/assets/img/example/img6.jpeg",
            "/assets/img/example/img7.jpeg",
            "/assets/img/example/img8.jpeg",
            "/assets/img/example/img9.png",
        ],
        stats: [
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
        ],
    };

    let resultPopup = $state(false);
    let nextFlag = $state(false);
    let imageTab = $state(true);
    let descriptionFlag = $state(false);
    let lives = $state(2); // 0 to 3

    function displayImages() {
        console.log("Images");
        imageTab = true;
        descriptionFlag = false;
    }

    function displayDescription() {
        imageTab = false;
        descriptionFlag = true;
    }

    function showResult() {
        resultPopup = true;

        setTimeout(() => {
            nextFlag = true;
        }, 1000);
    }

    function percentageDifference() {
        // Avoid division by zero
        if (question.answer === 0 && guessResult === 0) {
            return 0;
        }

        // Calculate the base as the average of absolute values
        const base = (Math.abs(question.answer) + Math.abs(guessResult)) / 2;

        // Calculate the absolute difference
        const difference = Math.abs(question.answer - guessResult);

        // Calculate percentage
        const percentage = (difference / base) * 100;

        return percentage;
    }

    function pointCalculation() {
        let difference = percentageDifference();
        if (difference > 100) return 0;

        let maxPoints = 500;
        let points = Math.round((100 - difference) / 100 * maxPoints);

        return points;
    }

    let guessResult = $state(1);
</script>

<content class="items-center relative overflow-visible">
    <!-- Main game content -->
    <div class="flex w-full justify-center z-50">
        <!-- main window -->
        <div class="rounded-2xl md:w-4/5 md:px-12">
            <div class="flex w-1/2 gap-2 ml-4">
                <Tab
                    color={imageTab ? "var(--white)" : "var(--default-shadow)"}
                    tabStatic={true}
                    shadow={false}
                    execFunction={displayImages}
                >
                    <span class="text-xl font-medium text-black">Images</span>
                </Tab>
                <Tab
                    color={imageTab ? "var(--default-shadow)" : "var(--white)"}
                    tabStatic={true}
                    shadow={false}
                    execFunction={displayDescription}
                >
                    <span class="text-xl font-medium text-black"
                        >Description</span
                    >
                </Tab>
            </div>
            <div class="flex flex-col w-full md:flex-row gap-5">
                <div
                    class="md:w-2/3 drop-shadow-[0_0.5rem_0_var(--default-shadow)]"
                >
                    <Carousel
                        images={question.images}
                        description={question.description}
                        {descriptionFlag}
                    />
                </div>
                <div
                    class="md:w-1/3 md:mb-0 mb-96 overflow-auto drop-shadow-[0_0.5rem_0_var(--default-shadow)] rounded-2xl bg-white"
                >
                    <div
                        class="w-full flex flex-col justify-between h-fit gap-2 p-2"
                    >
                        {#each question.stats as stat}
                            <Stat icon={stat.icon} text={stat.text} />
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Bottom UI -->
    <div
        class="fixed bottom-0 margin-x-auto flex flex-row-reverse flex-wrap w-full md:gap-10 md:justify-center"
    >
        <!-- Lives -->
        <div class="lives">
            <img
                src="/assets/svg/traffic {lives}.svg"
                alt="lives"
                class="w-52 h-28 flex content-end"
            />
        </div>
        <div
            class="p-2.5 rounded-t-2xl w-fit flex max-w-3xl"
            style:background-color="var(--default-shadow)"
        >
            <div class="flex grow gap-2.5 text-white">
                <PriceSlider min="0" max="10" bind:guessValue={guessResult} />
                <Button
                    color="var(--default-button)"
                    bgcolor="var(--default-button-dark)"
                    buttonHeight="4.5rem"
                    buttonWidth="5.5rem"
                    execFunction={showResult}
                >
                    <span class="check-align-vertical">
                        <Check strokeWidth={5} size={35} />
                    </span>
                </Button>
            </div>
        </div>
    </div>
</content>

<!-- Result Popups -->
{#if resultPopup}
    <Popup
        title="Round results"
        closeFunction={() => {
            resultPopup = false;
        }}
    >
        <div class="h-full flex flex-col justify-evenly items-center">
            <div class="flex flex-col items-center">
                {#if nextFlag}
                    <p
                        transition:fly={{ y: -50 }}
                        class="font-bold text-green text-7xl mb-5"
                    >
                        {"Not bad!".toUpperCase()}
                    </p>
                    <p
                        transition:slide={{ delay: 500 }}
                        class="text-black text-base"
                    >
                        Your guess of <span class="text-orange font-semibold"
                            >${guessResult.toLocaleString()}</span
                        >
                        was only
                        <span class="text-orange font-semibold"
                            >{percentageDifference().toFixed(2)}% off.</span
                        >
                    </p>
                    <p
                        transition:slide={{ delay: 500 }}
                        class="text-black text-base"
                    >
                        You get <span class="text-green font-semibold"
                            >{pointCalculation()} points.</span
                        >
                    </p>
                {/if}
            </div>
            <div>
                <h1 class="font-bold text-black text-4xl">
                    scrolling bar thingy here...
                </h1>
            </div>
            {#if nextFlag}
                <div transition:fly={{ x: -50, delay: 1000 }}>
                    <Button
                        buttonWidth="8rem"
                        execFunction={() => {
                            nextFlag = true;
                            resultPopup = false;
                        }}
                    >
                        <span class="text-white text-xl font-medium">Next</span>
                    </Button>
                </div>
            {/if}
        </div>
    </Popup>
{/if}

<style>
    @media (max-width: 768px) {
        .lives img {
            height: 20vw; /* adjusts the size of the image */
            transform: translateY(25%);
        }
    }

    .check-align-vertical {
        margin-top: 3px;
    }
</style>
