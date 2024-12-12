<script>
    import Button from "$lib/components/Button.svelte";
    import Tab from "$lib/components/Tab.svelte";
    import { goto } from "$app/navigation";
    import { difficulty } from "$lib/stores/gameStore";

    function setDifficulty(value) {
        console.log(`Difficulty set to ${value} from ${difficulty}`);
        difficulty.set(value);
    }
</script>

<!-- Logo -->
 <div class="fixed mx-auto left-0 right-0 top-1/4 flex justify-center">
    <img
    class="w-[60vw] max-w-[70rem] drop-shadow-[0px_10px_0px_rgba(231,_101,_49,_0.15)] logo-animation"
    src="assets/svg/logo.svg"
    alt="Logo" />
 </div>

<content class="flex fw-full mt-5 custom-content-size">
    <!-- Bottom Area -->
    <div
        class="flex flex-row justify-start p-8 mt-5 fixed items-center bottom-0 left-0 right-0">
        <div class="flex flex-col overflow-clip">
            <!-- Difficulties -->
            <div class="flex flex-row max-w-64 ml-2">
                <Tab color="var(--green-button)" selected={Boolean($difficulty == 1)} execFunction={setDifficulty(1)}>
                    <span class="text-xl font-medium">Beginner</span>
                </Tab>
                <Tab color="var(--default-button)" selected={Boolean($difficulty == 2)} execFunction={setDifficulty(2)}>
                    <span class="text-xl font-medium">Advanced</span>
                </Tab>
                <Tab color="rgb(52, 49, 49)" selected={Boolean($difficulty == 3)} execFunction={setDifficulty(3)}>
                    <span class="text-xl font-medium">Expert</span>
                </Tab>
            </div>
            <!-- Play Button -->
            <div>
                <Button
                    buttonHeight="10rem"
                    buttonWidth="21rem"
                    shadowHeight="0.5rem"
                    execFunction={() => goto("/game")}>
                    <img
                        src="/assets/svg/play.svg"
                        alt="play button"
                        style:width="3rem" />
                </Button>
            </div>
            <!-- Autocards Button -->
            <div class="my-3">
                <Button
                    color="var(--green-button)"
                    bgcolor="var(--green-button-dark)"
                    buttonHeight="4rem"
                    buttonWidth="21rem"
                    shadowHeight="0.5rem"
                    execFunction={() => goto("/auto-cards")}>
                    <div
                        class="flex flex-row items-center justify-between w-full px-2">
                        <span class="text-white font-bold text-4xl"
                            >AutoCards</span>
                        <img
                            src="/assets/svg/autocards icon.svg"
                            alt=""
                            style:width="3rem" />
                    </div>
                </Button>
            </div>
        </div>
    </div>
</content>

<style>
    .custom-content-size {
        height: calc(100dvh - 135px);
    }

    .logo-animation {
        animation: dynamicPulse 8s infinite ease-in-out;
    }

    @keyframes dynamicPulse {
        0%,
        100% {
            transform: scale(1) translateY(0);
        }
        25% {
            transform: scale(1.02) translateY(-3px); /* Slight growth and upward movement */
        }
        50% {
            transform: scale(1.01) translateY(0); /* Slight reduction and centered */
        }
        75% {
            transform: scale(1.02) translateY(3px); /* Slight growth and downward movement */
        }
    }
</style>
