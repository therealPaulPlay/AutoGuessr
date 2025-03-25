<script>
	import { get } from "svelte/store";
	import { goto } from "$app/navigation";
	import { score, gameRounds } from "$lib/stores/gameStore";
	import { highscore } from "$lib/stores/accountStore";
	import { Home, Share, Repeat, LoaderCircle } from "lucide-svelte";
	import Button from "$lib/components/Button.svelte";
	import html2canvas from "html2canvas";
	import { currentPlayers, multiplayerFlag, peer, playersInGame } from "$lib/stores/multiplayerStore";
	import { getPlayerInfo, getPlayerWithHighestScore, leaveMultiplayerRoom, resetMultiplayerScores } from "$lib/utils/multiplayer";
	import { flip } from "svelte/animate";

	let mainContent = $state();
	let resultTable = $state();
	let watermark = $state();
	let innerWidth = $state();
	let showPlayAgain = $state(true);
	let playAgainClicked = $state(false);
	let title = $state("Game Over!");

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

	$effect(() => {
		if($multiplayerFlag) {
			title = $playersInGame.length ? "On Going..." : `${getPlayerWithHighestScore().name} won!`
		} else title = "Game Over!"
	})
</script>

<svelte:head>
	<title>Game Over</title>
</svelte:head>

<svelte:window bind:innerWidth />

<content class="flex items-center justify-center w-full min-h-full" bind:this={mainContent}>
	<div class="flex justify-center items-center flex-col w-full max-w-2xl pb-5 pt-2">
		<h1 class="text-7xl max-md:text-5xl font-bold text-wrap text-orange mb-6 text-center">{title}</h1>
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
		{#if $multiplayerFlag}
			<div
				class="w-4/5 bg-tanMedium rounded-lg px-2 mb-2 -mt-10 max-h-[6.5rem] overflow-y-auto no-capture no-last-border"
			>
				{#each $currentPlayers as ele (ele)}
					<!-- Flip animation works in Firefox but not in chrome for some reason. Maybe try GSAP? -->
					<div
						animate:flip={{}}
						class="w-full flex justify-between p-1 text-center text-black truncate border-b-2 border-black/10"
					>
						<p class="w-5/6 overflow-clip text-ellipsis">
							{getPlayerInfo(ele.id).name}
						</p>
						<p class="w-1/6">
							{ele.score}
						</p>
					</div>
				{/each}
			</div>
		{/if}
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
			Play on<span class="text-orange font-semibold">&nbsp;AutoGuessr.com!</span>
		</p>
		<div class="flex gap-5 flex-wrap justify-center items-center no-capture">
			<!-- TODO: The peer.isHost is not reactive, maybe put into an effect (?) -->
			<Button
				buttonHeight="4rem"
				buttonWidth={innerWidth >= 768 ? "14rem" : "4rem"}
				shadowHeight="0.5rem"
				color="var(--green-button)"
				bgcolor="var(--green-button-dark)"
				disabled={$multiplayerFlag && (!$peer?.isHost || $playersInGame?.length || $currentPlayers.length <= 1)}
				onclick={() => {
					if ($multiplayerFlag && !playAgainClicked) {
						playAgainClicked = true;
						$peer?.updateStorage("gameInProgress", true);
						$peer?.updateStorage("questionsIds", []);
						$peer?.updateStorage("matchIndex", $peer?.getStorage?.matchIndex + 1);
						resetMultiplayerScores();
						return;
					}
					goto("/game");
				}}
			>
				{#if innerWidth >= 768}
					<!-- Render text on larger screens -->
					<span class="text-white font-semibold text-3xl">
						{#if playAgainClicked}
							<div class="animate-spin">
								<LoaderCircle strokeWidth={3} size={28} color={"var(--white)"} />
							</div>
						{:else}
							Play again
						{/if}
					</span>
				{:else}
					<!-- Render an icon on smaller screens -->
					<span class="text-white text-3xl">
						{#if playAgainClicked}
							<div class="animate-spin">
								<LoaderCircle strokeWidth={3} size={28} color={"var(--white)"} />
							</div>
						{:else}
							<Repeat strokeWidth={3} size={28} />
						{/if}</span
					>
				{/if}
			</Button>
			<Button
				buttonHeight="4rem"
				buttonWidth="4rem"
				shadowHeight="0.5rem"
				onclick={() => {
					if ($multiplayerFlag) leaveMultiplayerRoom();
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

	.no-last-border > div:last-child {
		border-bottom: none !important;
	}
</style>
