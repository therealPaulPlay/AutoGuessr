<script>
	import Button from "$lib/components/Button.svelte";
	import Tab from "$lib/components/Tab.svelte";
	import Popup from "$lib/components/Popup.svelte";
	import { goto } from "$app/navigation";
	import { difficulty, difficultyRules } from "$lib/stores/gameStore";

	let difficultyValue = $state(1);
	let explanationPopup = $state(false);

	$effect(() => {
		difficulty.set(difficultyValue);
	});
</script>

<!-- Logo -->
<div class="fixed mx-auto left-0 right-0 top-1/4 flex justify-center">
	<img
		class="w-[60vw] max-w-[70rem] drop-shadow-[0px_10px_0px_rgba(231,_101,_49,_0.15)] logo-animation"
		src="/assets/svg/logo.svg"
		alt="Logo"
	/>
</div>

<svelte:head>
	<title>AutoGuessr - Guess the car's price!</title>
</svelte:head>

<content class="flex w-full mt-5">
	<!-- Bottom Area -->
	<div class="flex flex-row justify-start p-8 mt-5 fixed items-center bottom-0 left-0 right-0">
		<div class="flex flex-col overflow-clip">
			<!-- Difficulties -->
			<div class="flex flex-row max-w-64 ml-2 gap-1">
				<Tab
					color="var(--green-button-dark"
					selectedColor="var(--green-button)"
					selected={Boolean($difficulty == 1)}
					onclick={() => (difficultyValue = 1)}
				>
					<span class="text-xl font-medium">Easy</span>
				</Tab>
				<Tab
					color="var(--default-button-dark)"
					selectedColor="var(--default-button)"
					selected={Boolean($difficulty == 2)}
					onclick={() => (difficultyValue = 2)}
				>
					<span class="text-xl font-medium">Medium</span>
				</Tab>
				<Tab
					color="rgb(75, 73, 73)"
					selectedColor="rgb(52, 49, 49)"
					selected={Boolean($difficulty == 3)}
					onclick={() => (difficultyValue = 3)}
				>
					<span class="text-xl font-medium">Hard</span>
				</Tab>
			</div>
			<!-- Play Button -->
			<div class="z-20 relative">
				<Button buttonHeight="10rem" buttonWidth="21rem" shadowHeight="0.5rem" onclick={() => goto("/game")}>
					<img src="/assets/svg/play.svg" alt="play button" style:width="3rem" />
				</Button>
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img
					src="/assets/svg/info.svg"
					alt="info"
					title="Game explanation"
					onclick={() => {
						explanationPopup = true;
					}}
					class="absolute z-10 right-2 top-2 w-9 cursor-pointer rounded-lg ease-out duration-150 hover:bg-white hover:bg-opacity-20 p-1"
				/>
			</div>
			<!-- Autocards Button -->
			<div class="my-3">
				<Button
					color="var(--green-button)"
					bgcolor="var(--green-button-dark)"
					buttonHeight="4rem"
					buttonWidth="21rem"
					shadowHeight="0.5rem"
					onclick={() => goto("/auto-cards")}
				>
					<div class="flex flex-row items-center justify-between w-full px-2">
						<span class="text-white font-bold text-4xl">AutoCards</span>
						<img src="/assets/svg/autocards icon.svg" alt="" style:width="3rem" />
					</div>
				</Button>
			</div>
		</div>
	</div>
</content>

<!-- Explanation Popup -->
{#if explanationPopup}
	<Popup title="" tall={true} closeFunction={() => (explanationPopup = false)}>
		<div class="w-full text-green flex justify-center text-5xl font-bold -mt-12 mb-12">How to play:</div>
		<div class="h-full">
			<h1 class="text-3xl font-bold mb-4">Guess the price!</h1>
			<p class="text-base">
				You will be shown a car and you have to guess the price of the car. The closer you are to the actual price, the
				more points you will get.
			</p>
			<h1 class="text-3xl font-bold mb-4 mt-8">Difficulties:</h1>
			<p class="text-base">
				<span class="text-greenDark font-semibold">Safe range</span> is the range where you will get points and not lose
				any lives. However, if you manage to land in
				<span class="text-green font-semibold">Reward range,</span> you will get an extra life!
			</p>
			<div class="flex items-center gap-4 overflow-hidden mt-2">
				<div class="basis-1/4">
					<Tab color="var(--green-button)" selected={false} onclick={() => {}}>
						<span class="text-xl font-medium">Easy</span>
					</Tab>
				</div>
				<div class="flex w-full justify-evenly">
					<p class="text-base">
						Safe range: <span class="text-greenDark font-semibold">0% — {$difficultyRules[1].correctTier[1]}%</span>
					</p>
					<p class="text-base">
						Reward range: <span class="text-green font-semibold">0% — {$difficultyRules[1].correctTier[0]}%</span>
					</p>
				</div>
			</div>
			<div class="flex items-center gap-4 overflow-hidden">
				<div class="basis-1/4">
					<Tab color="var(--default-button)" selected={false} onclick={() => {}}>
						<span class="text-xl font-medium">Medium</span>
					</Tab>
				</div>
				<div class="flex w-full justify-evenly">
					<p class="text-base">
						Safe range: <span class="text-greenDark font-semibold">0% — {$difficultyRules[2].correctTier[1]}%</span>
					</p>
					<p class="text-base">
						Reward range: <span class="text-green font-semibold">0% — {$difficultyRules[2].correctTier[0]}%</span>
					</p>
				</div>
			</div>
			<div class="flex items-center gap-4 overflow-hidden">
				<div class="basis-1/4">
					<Tab color="rgb(75, 73, 73)" selected={false} onclick={() => {}}>
						<span class="text-xl font-medium">Hard</span>
					</Tab>
				</div>
				<div class="flex w-full justify-evenly">
					<p class="text-base">
						Safe range: <span class="text-greenDark font-semibold">0% — {$difficultyRules[3].correctTier[1]}%</span>
					</p>
					<p class="text-base">
						Reward range: <span class="text-green font-semibold">0% — {$difficultyRules[3].correctTier[0]}%</span>
					</p>
				</div>
			</div>
		</div>
	</Popup>
{/if}

<style>
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
