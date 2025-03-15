<script>
	import Button from "$lib/components/Button.svelte";
	import Tab from "$lib/components/Tab.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import PWFPopup from "$lib/components/PWFPopup.svelte";
	import { goto } from "$app/navigation";
	import { difficulty, difficultyRules } from "$lib/stores/gameStore";
	import { howToPlayPopup } from "$lib/stores/uiStore";
	import { PWFPopupBody } from "$lib/stores/multiplayerStore";
	import { onMount } from "svelte";
	import CarModel from "$lib/components/CarModel.svelte";

	function setDifficulty(difficultyLevel) {
		localStorage.setItem("difficulty", difficultyLevel);
		difficulty.set(difficultyLevel);
	}

	onMount(() => {
		const loadedDifficulty = localStorage.getItem("difficulty");
		if (loadedDifficulty) difficulty.set(Number(loadedDifficulty));
	});
</script>

<svelte:head>
	<title>AutoGuessr - Guess car listing prices!</title>
</svelte:head>

<!-- Logo -->
<div class="fixed mx-auto left-0 right-0 top-[20%] flex justify-center max-md:hidden">
	<img
		class="w-[60vw] max-md:w-[80vw] max-w-[70rem] drop-shadow-[0px_10px_0px_rgba(237,209,182)] logo-animation"
		src="/assets/svg/logo.svg"
		alt="Logo"
	/>
</div>

<!-- Keywords -->
<h1 class="hidden">
	AutoGuessr is a fun and free car meta quiz game in which you guess the real prices of online car listings, including
	sportscars and supercars, from vendors across the US. This automotive trivia game, playable in the browser, is perfect
	for car driving and racing enthusiasts. Looking for the best free car game with no download? Look no further.
</h1>

<!-- car model -->
<CarModel />

<content class="flex w-full mt-5">
	<!-- Bottom Area -->
	<div class="flex justify-start p-8 mt-5 fixed items-center bottom-0 left-0 right-0 max-md:justify-center">
		<div class="flex flex-col overflow-clip max-w-[calc(100%-0.25rem)] gap-3">
			<div>
				<!-- Difficulties -->
				<div class="flex max-w-64 ml-2 gap-1">
					<Tab
						color="var(--green-button-dark"
						selectedColor="var(--green-button)"
						selected={Boolean($difficulty == 1)}
						onclick={() => setDifficulty(1)}
					>
						<span class="text-xl">Easy</span>
					</Tab>
					<Tab
						color="var(--default-button-dark)"
						selectedColor="var(--default-button)"
						selected={Boolean($difficulty == 2)}
						onclick={() => setDifficulty(2)}
					>
						<span class="text-xl">Medium</span>
					</Tab>
					<Tab
						color="rgb(75, 73, 73)"
						selectedColor="rgb(52, 49, 49)"
						selected={Boolean($difficulty == 3)}
						onclick={() => setDifficulty(3)}
					>
						<span class="text-xl">Hard</span>
					</Tab>
				</div>
				<!-- Play Button -->
				<div class="z-20 relative">
					<Button
						buttonHeight="7rem"
						buttonWidth="21rem"
						shadowHeight="0.5rem"
						onclick={() => goto("/game")}
						customClasses="!w-full"
					>
						<img src="/assets/svg/play.svg" alt="play button" style:width="2.5rem" />
					</Button>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<img
						src="/assets/svg/info.svg"
						alt="info"
						title="Game explanation"
						onclick={() => {
							$howToPlayPopup = true;
						}}
						class="absolute z-10 right-2 top-2 w-10 cursor-pointer rounded-lg ease-out duration-150 bg-orangeDark hover:bg-orangeDark/50 p-2"
					/>
				</div>
				<!-- Play with friends -->
				<div class="mt-1">
					<Button
						customClasses="!w-full"
						buttonHeight="4rem"
						buttonWidth="21rem"
						shadowHeight="0.5rem"
						onclick={() => {
							$PWFPopupBody = true;
						}}
					>
						<div class="flex flex-row items-center justify-between w-full px-2">
							<span class="text-white font-semibold text-3xl mr-10">Multiplayer</span>
							<img src="/assets/svg/group.svg" alt="" style:width="3rem" />
						</div>
					</Button>
				</div>
			</div>
			<!-- Autocards Button -->
			<div>
				<Button
					color="var(--green-button)"
					bgcolor="var(--green-button-dark)"
					customClasses="!w-full"
					buttonHeight="4rem"
					buttonWidth="21rem"
					shadowHeight="0.5rem"
					onclick={() => goto("/auto-cards")}
				>
					<div class="flex flex-row items-center justify-between w-full px-2">
						<span class="text-white font-semibold text-3xl mr-5">AutoCards</span>
						<img src="/assets/svg/autocards icon.svg" alt="" style:width="3rem" />
					</div>
				</Button>
			</div>
		</div>
	</div>
</content>

<style>
	.logo-animation {
		animation: dynamicPulse 8s infinite ease-in-out;
	}

	@keyframes dynamicPulse {
		0%,
		100% {
			transform: scale(1);
		}
		25% {
			transform: scale(1.02);
		}
		50% {
			transform: scale(1.01);
		}
		75% {
			transform: scale(1.02);
		}
	}
</style>
