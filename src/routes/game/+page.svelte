<script>
    import Carousel from "$lib/components/Carousel.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import Stat from "$lib/components/Stat.svelte";
    import PriceSlider from "$lib/components/PriceSlider.svelte";
    import Button from "$lib/components/Button.svelte";
    import Popup from "$lib/components/Popup.svelte";
    import GuessDisplay from "../../lib/components/GuessDisplay.svelte";
    import { goto } from "$app/navigation";
    import { ArrowRightCircle, Check } from "lucide-svelte";
    import { fly, slide } from "svelte/transition";
    import { difficulty, lives, score } from "$lib/stores/gameStore";
    import { onMount } from "svelte";

    const difficultyRules = {
        1: {
            correctTier: [10, 20],
        },
        2: {
            correctTier: [5, 10],
        },
        3: {
            correctTier: [1, 5],
            penaltyThreshold: 10, // Only applies for difficulty 3
        },
    };

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
    let rewardFlag = $state(false);
    let penaltyFlag = $state(false);
    let imageTab = $state(true);
    let descriptionFlag = $state(false);
    score.set(0);

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
        checkPlayerPerformance(percentageDifference());

        resultPopup = true;
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
        let points = Math.round(((100 - difference) / 100) * maxPoints);

        return points;
    }

    function checkPlayerPerformance(percent) {
        const rules = difficultyRules[$difficulty];
        if (!rules) {
            throw new Error("Invalid difficulty level.");
        }

        const [lowerBound, upperBound] = rules.correctTier;

        if (percent <= upperBound) {
            addScore(1);
        }

        if (percent <= lowerBound) {
            // Give the player an extra life if they get it within the lower bound
            addLife(1);
            return;
        }

        // Check if the player's performance is within the "correct tier"
        if (percent >= lowerBound && percent <= upperBound) {
            rewardFlag = false;
            return;
        }

        // Check if the penalty logic applies (only for difficulty 3)
        if ($difficulty === 3 && percent > rules.penaltyThreshold) {
            subtractLife(2);
            return;
        }

        subtractLife(1);
        return;
    }

    function addLife(amount) {
        penaltyFlag = false;
        rewardFlag = true;
        lives.update((l) => {
            return l + amount > 3 ? 3 : l + amount;
        });
    }

    function subtractLife(amount) {
        rewardFlag = false;
        penaltyFlag = true;
        lives.update((l) => {
            return l - amount < 0 ? 0 : l - amount;
        });
    }

    function addScore(amount) {
        score.update((c) => c + amount);
    }

    function goToNextQuestion() {
        // Reset the variables
        guessResult = 1; // Why is this not resetting?
        rewardFlag = false;
        penaltyFlag = false;
        resultPopup = false;

        if ($lives === 0) {
            // Redirect to the game over page
            goto("/game/end");
            return;
        }
    }

    let guessResult = $state(1);

    onMount(() => {
        lives.set(3);
    });
</script>

<svelte:head>
    <title>Game</title>
</svelte:head>

<content class="items-center relative overflow-visible">
    <!-- Main game content -->
    <div class="flex w-full justify-center z-50">
        <!-- main window -->
        <div class="rounded-2xl md:w-4/5 md:px-12">
            <div class="flex w-1/2 gap-2 ml-4">
                <Tab
                    color={imageTab ? "var(--white)" : "var(--default-shadow)"}
                    shadow={false}
                    execFunction={displayImages}>
                    <span class="text-xl font-medium text-black">Images</span>
                </Tab>
                <Tab
                    color={imageTab ? "var(--default-shadow)" : "var(--white)"}
                    shadow={false}
                    execFunction={displayDescription}>
                    <span class="text-xl font-medium text-black"
                        >Description</span>
                </Tab>
            </div>
            <div class="flex flex-col w-full md:flex-row gap-5">
                <div
                    class="md:w-2/3 drop-shadow-[0_0.5rem_0_var(--default-shadow)]">
                    <Carousel
                        images={question.images}
                        description={question.description}
                        {descriptionFlag} />
                </div>
                <div
                    class="md:w-1/3 md:mb-0 mb-96 overflow-auto drop-shadow-[0_0.5rem_0_var(--default-shadow)] rounded-2xl bg-white">
                    <div
                        class="w-full flex flex-col justify-between h-fit gap-2 p-2">
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
        class="fixed bottom-0 margin-x-auto flex flex-row-reverse flex-wrap w-full md:gap-10 md:justify-center">
        <!-- Lives -->
        <div class="lives">
            <img
                src="/assets/svg/traffic {$lives}.svg"
                alt="lives"
                class="w-52 h-28 flex content-end" />
        </div>
        <div
            class="p-2.5 rounded-t-2xl w-fit flex max-w-3xl"
            style:background-color="var(--default-shadow)">
            <div class="flex grow gap-2.5 text-white">
                <PriceSlider min="0" max="10" bind:guessValue={guessResult} />
                <Button
                    color="var(--default-button)"
                    bgcolor="var(--default-button-dark)"
                    buttonHeight="4.5rem"
                    buttonWidth="5.5rem"
                    execFunction={showResult}>
                    <span class="check-align-vertical">
                        <Check strokeWidth={5} size={30} />
                    </span>
                </Button>
            </div>
        </div>
    </div>
</content>

<!-- Result Popups -->
{#if resultPopup}
    <Popup title="" closeFunction={goToNextQuestion} showCloseButton={false}>
        <div class="h-full flex flex-col justify-evenly items-center">
            <div class="flex flex-col items-center">
                <p
                    in:fly={{ y: -50, delay: 500 }}
                    class="font-bold text-green text-7xl mb-5 text-center">
                    {"Not bad!".toUpperCase()}
                </p>
                <p class="text-black text-base text-center" in:fly={{ y: -50, delay: 500 }}>
                    Your guess of <span class="text-orange font-semibold"
                        >${guessResult.toLocaleString()}</span>
                    was only
                    <span class="text-orange font-semibold"
                        >{percentageDifference().toFixed(2)}% off.</span>
                </p>
                <p in:slide={{ delay: 250 }} class="text-black text-base text-center">
                    You get <span class="text-green font-semibold"
                        >{pointCalculation()} points{rewardFlag
                            ? " and an extra life!"
                            : "."}</span>
                    {#if penaltyFlag}
                        <span class="font-semibold text-red-600 decoration-2"
                            >You lose {$difficulty === 3
                                ? "2 lives."
                                : "a life."}</span>
                    {/if}
                </p>
            </div>
            <div class="bg-tanDark w-full rounded-lg h-14 mt-10">
                <GuessDisplay
                    answer={question.answer}
                    guess={guessResult}
                    percentageDifference={percentageDifference().toFixed(2)} />
            </div>
            <div in:fly={{ x: -50, delay: 2500 }}>
                <Button
                    buttonWidth="12rem"
                    buttonHeight="4rem"
                    execFunction={goToNextQuestion}>
                    <span
                        class="text-white text-xl font-medium flex items-center justify-center gap-2"
                        >Next <ArrowRightCircle strokeWidth={3} /></span>
                </Button>
            </div>
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
