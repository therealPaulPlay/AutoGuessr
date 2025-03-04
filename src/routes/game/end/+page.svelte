<script>
	import { get } from "svelte/store";
	import { goto } from "$app/navigation";
	import { score, gameRounds } from "$lib/stores/gameStore";
	import { highscore } from "$lib/stores/accountStore";
	import { Home, Share } from "lucide-svelte";
	import Button from "$lib/components/Button.svelte";
	import html2canvas from "html2canvas";

	let mainContent = $state();
	let resultTable = $state();
	let watermark = $state();

	function captureScreen() {
		if (!resultTable) return;

		// Store original styles
		const originalHeight = resultTable.style.maxHeight;
		const originalOverflow = resultTable.style.overflow;

		// Expand the table fully before capturing
		resultTable.style.maxHeight = "none";

		// This is a fix because for some reason text-center doesn't center in screenshot
		resultTable.querySelectorAll("td, th").forEach((td) => {
			td.style.paddingBottom = "2rem";
		});

		// Show the extra element before capturing
		watermark.classList.remove("hidden");

		html2canvas(mainContent, {
			logging: false,
			backgroundColor: "#f7f0e0",
			ignoreElements: (element) => element.classList.contains("no-capture"),
			scrollX: 0,
			scrollY: 0,
			windowWidth: resultTable.scrollWidth * 1.3, // Capture full width and a bit more to look better
			windowHeight: resultTable.scrollHeight, // Capture full height
		}).then((canvas) => {
			const img = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.href = img;
			link.download = "Autoguessr-game-over.png";
			link.click();
		});

		// Restore original styles
		resultTable.style.maxHeight = originalHeight;
		resultTable.querySelectorAll("td, th").forEach((td) => {
			td.style.paddingBottom = "";
		});

		// Hide the extra element again
		watermark.classList.add("hidden");
	}
</script>

<svelte:head>
	<title>Game Over</title>
</svelte:head>

<content class="flex items-center justify-center w-full min-h-full" bind:this={mainContent}>
	<div class="flex justify-center items-center flex-col w-full max-w-2xl pb-5 pt-2">
		<h1 class="text-7xl max-md:text-5xl font-bold text-wrap text-orange mb-6 text-center">Game Over!</h1>
		<div class="mb-12 text-center w-4/5 text-base">
			<div class="rounded-xl bg-tanMedium w-fit px-2 mx-auto mb-2 no-capture">
				<p>Tip: {$score < 5 ? "Get 5 correct guesses to draw a card!" : "Higher scores result in more rare cards!"}</p>
			</div>
			<p class="w-full max-w-full">
				You got <span class="text-green font-bold">{$score}</span>
				correct guess{$score == 1 ? "" : "es"}!
				{#if $score == $highscore}
					New highscore!
				{:else}
					Previous highscore:
					<span class="text-orange font-bold">{$highscore}.</span>
				{/if}
			</p>
		</div>
		<div
			bind:this={resultTable}
			class="w-4/5 mb-10 bg-white rounded-lg overflow-auto overscroll-none drop-shadow-[0px_5px_0px_var(--white-shadow)] no-scrollbar max-h-[30vh]"
		>
			<table class="table-auto w-full h-full">
				<thead class="text-white bg-orange border-b-2 border-white">
					<tr class="head-row">
						<th>Round</th>
						<th>Guess</th>
						<th>Answer</th>
						<th>Difference</th>
						<th>Points</th>
					</tr>
				</thead>
				<tbody>
					{#each $gameRounds as round, index}
						<tr class="text-center row" class:green-row={round.rewardFlag} class:red-row={round.penaltyFlag}>
							<td>{index + 1}</td>
							<td>${round.guess.toLocaleString()}</td>
							<td>${round.answer.toLocaleString()}</td>
							<td>{round.difference.toFixed(2)}%</td>
							<td>{round.points}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p bind:this={watermark} class="text-base hidden">
			Play on<span class="text-orange font-bold">&nbsp;Autoguessr.com!</span>
		</p>
		<div class="flex gap-5 flex-wrap justify-center items-center no-capture">
			<Button
				buttonHeight="4rem"
				buttonWidth="14rem"
				shadowHeight="0.5rem"
				color="var(--green-button)"
				bgcolor="var(--green-button-dark)"
				onclick={() => {
					goto("/game");
				}}
			>
				<span class="text-white font-semibold text-3xl">Play again</span>
			</Button>
			<Button
				buttonHeight="4rem"
				buttonWidth="4rem"
				shadowHeight="0.5rem"
				onclick={() => {
					goto("/");
				}}
			>
				<span class="text-white text-3xl"><Home strokeWidth={3} size={28} /></span>
			</Button>
			<Button buttonHeight="4rem" buttonWidth="4rem" shadowHeight="0.5rem" onclick={captureScreen}>
				<span class="text-white text-3xl"><Share strokeWidth={3} size={28} /></span>
			</Button>
		</div>
	</div>
</content>

<style>
	.green-row {
		background-color: var(--green-button);
	}

	.red-row {
		background-color: var(--tan-medium);
	}

	.head-row th {
		padding: 1.25rem 0.5rem;
	}

	.row td {
		padding: 1rem 0.5rem;
	}
</style>
