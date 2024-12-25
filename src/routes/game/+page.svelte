<script>
    import { PUBLIC_API_URL } from "$env/static/public";
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
    import {
        difficulty,
        lives,
        score,
        difficultyRules,
    } from "$lib/stores/gameStore";
    import { onMount } from "svelte";

    const messages = {
        bad: ["Keep going!", "Stay strong!", "You got this!", "Not quite..."],
        good: ["Nice work!", "Keep it up!", "Well done!", "Very good!"],
        great: [
            "Amazing job!",
            "You're unstoppable!",
            "Keep shining!",
            "Just WOW!",
        ],
    };

    let question = $state({});

    async function getQuestion() {
        const data = await getData();
        question.answer = data.price;
        question.description = data.description;
        question.images = data.photos;
        question.stats = [
            { icon: "/assets/svg/car.svg", text: data.name },
            {
                icon: "/assets/svg/mileage.svg",
                text: data.mileage.toLocaleString() + " mi.",
            },
            { icon: "/assets/svg/transmission.svg", text: data.transmission },
            { icon: "/assets/svg/date.svg", text: data.year },
            { icon: "/assets/svg/owner.svg", text: data.condition },
            { icon: "/assets/svg/engine.svg", text: data.engineType },
        ];
    }

    let resultPopup = $state(false);
    let rewardFlag = $state(false);
    let penaltyFlag = $state(false);
    let extraPenaltyFlag = $state(false);
    let blinkingFlag = $state(false);
    let imageTab = $state(true);
    let descriptionFlag = $state(false);
    let blinkingLives = $state();
    let popupMessage = $state("Loading...");
    let nextButton = $state();
    let livesImage = $state(3);
    let submitButton;
    score.set(0);

    async function getData() {
        const url = `${PUBLIC_API_URL}/car-data/standard/random`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.error(error.message);
        }
    }

    function displayImages() {
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
        const rules = $difficultyRules[$difficulty];
        if (!rules) {
            throw new Error("Invalid difficulty level.");
        }

        const [lowerBound, upperBound] = rules.correctTier;

        if (percent <= upperBound) {
            setPopupMessage("good");
            addScore(1);
        }

        if (percent <= lowerBound) {
            // Give the player an extra life if they get it within the lower bound
            setPopupMessage("great");
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
            console.log(`Percent: ${percent}`);
            subtractLife(2, true);
            return;
        }

        setPopupMessage("bad");
        subtractLife(1);
        return;
    }

    function addLife(amount) {
        penaltyFlag = false;
        extraPenaltyFlag = false;
        rewardFlag = true;
        lives.update((l) => {
            return l + amount > 4 ? 4 : l + amount;
        });
    }

    function subtractLife(amount, extraPenalty = false) {
        rewardFlag = false;
        penaltyFlag = true;
        extraPenaltyFlag = extraPenalty;
        lives.update((l) => {
            return l - amount < 0 ? 0 : l - amount;
        });
    }

    function addScore(amount) {
        score.update((c) => c + amount);
    }

    function goToNextQuestion() {
        guessResult = 1;
        rewardFlag = false;
        penaltyFlag = false;
        resultPopup = false;

        if ($lives <= 0) {
            // Redirect to the game over page
            goto("/game/end");
            return;
        }
    }

    function setPopupMessage(condition) {
        if (messages[condition]) {
            const conditionMessages = messages[condition];
            popupMessage =
                conditionMessages[
                    Math.floor(Math.random() * conditionMessages.length)
                ];
        } else {
            console.log("Invalid condition provided."); // Handle unexpected conditions
        }
    }

    function onkeydown(event) {
        if (event.key === "Enter" && !resultPopup) {
            submitButton.click();
        }
        if (event.key === "Enter" && resultPopup) {
            nextButton.click();
        }
    }

    $effect(() => {
        // Makes blinkingLives switch between 1 and 2 on 2 lives
        // Using a separate variable to $lives because using it may cause issues.
        if ($lives === 2) {
            blinkingFlag = true;
            setInterval(() => {
                blinkingLives = blinkingLives === 1 ? 2 : 1; // Toggle between 1 and 2
            }, 1000);
        } else {
            blinkingFlag = false;
        }
    });

    $effect(() => {
        // Adjusts the lvies image do display the correct image
        if ($lives < 2) {
            livesImage = $lives;
        } else {
            livesImage = $lives - 1;
        }
    });

    let guessResult = $state(1);

    onMount(() => {
        getQuestion();
        lives.set(3);
    });
</script>

<svelte:window {onkeydown} />
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
                    execFunction={displayImages}
                >
                    <span class="text-xl font-medium text-black">Images</span>
                </Tab>
                <Tab
                    color={imageTab ? "var(--default-shadow)" : "var(--white)"}
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
        <div class="lives relative">
            <img
                src="/assets/svg/traffic {blinkingFlag
                    ? blinkingLives
                    : livesImage}.svg"
                alt="lives"
                class="w-52 h-28 flex content-end relative z-10"
            />
        </div>
        <div
            class="p-2.5 rounded-t-2xl w-fit flex max-w-3xl"
            style:background-color="var(--default-shadow)"
        >
            <div class="flex grow gap-2.5 text-white">
                <PriceSlider min="0" max="10" bind:guessValue={guessResult} />
                <Button
                    bind:this={submitButton}
                    color="var(--default-button)"
                    bgcolor="var(--default-button-dark)"
                    buttonHeight="4.5rem"
                    buttonWidth="5.5rem"
                    execFunction={showResult}
                >
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
                    class="font-bold text-green text-7xl mb-5 text-center"
                >
                    {popupMessage.toUpperCase()}
                </p>
                <p
                    class="text-black text-base text-center"
                    in:fly={{ y: -50, delay: 500 }}
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
                    in:slide={{ delay: 250 }}
                    class="text-black text-base text-center"
                >
                    You get <span class="text-green font-semibold"
                        >{pointCalculation()} points{rewardFlag
                            ? " and an extra life!"
                            : "."}</span
                    >
                    {#if penaltyFlag}
                        <span class="font-semibold text-red-600 decoration-2"
                            >You lose {$difficulty === 3 && extraPenaltyFlag
                                ? "2 lives."
                                : "a life."}</span
                        >
                    {/if}
                </p>
            </div>
            <div class="w-full h-14 mt-10">
                <GuessDisplay
                    answer={question.answer}
                    guess={guessResult}
                    percentageDifference={percentageDifference().toFixed(2)}
                />
            </div>
            <div in:fly={{ x: -50, delay: 2500 }}>
                <Button
                    bind:this={nextButton}
                    buttonWidth="12rem"
                    buttonHeight="4rem"
                    execFunction={goToNextQuestion}
                >
                    <span
                        class="text-white text-xl font-medium flex items-center justify-center gap-2"
                        >Next <ArrowRightCircle strokeWidth={3} /></span
                    >
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
