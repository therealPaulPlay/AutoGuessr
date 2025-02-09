<script>
	import { get } from "svelte/store";
	import { goto } from "$app/navigation";
	import { score, gameRounds } from "$lib/stores/gameStore";
	import { highscore } from "$lib/stores/accountStore";
	import { Home } from "lucide-svelte";
	import Button from "$lib/components/Button.svelte";
</script>

<svelte:head>
	<title>Game Over</title>
</svelte:head>

<content class="flex items-center justify-center h-full overflow-y-visible">
	<div class="-mt-12 flex justify-center items-center flex-col">
		<h1 class="text-7xl max-md:text-5xl font-bold text-wrap text-orange mb-6 text-center">Game Over!</h1>
		<div class="mb-16 text-center w-4/5 text-base">
			<div class="rounded-xl bg-tanMedium w-fit px-2 mx-auto mb-2">
				<p>Tip: {$score < 5 ? "Get 5 correct guesses to draw a card!" : "Higher scores result in more rare cards!"}</p>
			</div>
			<p class="w-full">
				You were able to get <span class="text-green font-bold">{$score}</span>
				correct guess{$score == 1 ? "" : "es"}! Your previous personal best was
				<span class="text-orange font-bold">{get(highscore)}.</span>
			</p>
		</div>
		<div
			class="w-4/5 mb-10 bg-white rounded-lg overflow-auto overscroll-none drop-shadow-[0px_5px_0px_var(--white-shadow)] no-scrollbar max-h-[30vh]"
		>
			<table class="table-auto w-full h-full">
				<thead class="bg-orange text-white border-b-2 border-white">
					<tr>
						<th class="py-5 px-2">Round</th>
						<th class="px-2">Guess</th>
						<th class="px-2">Answer</th>
						<th class="px-2">Difference</th>
						<th class="px-2">Points</th>
					</tr>
				</thead>
				<tbody>
					{#each $gameRounds as round, index}
						<tr class="text-center" class:green-row={round.rewardFlag} class:red-row={round.penaltyFlag}>
							<td class="px-4 py-2">{index + 1}</td>
							<td class="px-4 py-2">${round.guess.toLocaleString()}</td>
							<td class="px-4 py-2">${round.answer.toLocaleString()}</td>
							<td class="px-4 py-2">{round.difference.toFixed(2)}%</td>
							<td class="px-4 py-2" s>{round.points}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="flex gap-5 flex-wrap justify-center items-center">
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
				<span class="text-white font-bold text-3xl">Play again</span>
			</Button>
			<Button
				buttonHeight="4rem"
				buttonWidth="4rem"
				shadowHeight="0.5rem"
				onclick={() => {
					goto("/");
				}}
			>
				<span class="text-white font-bold text-3xl"><Home strokeWidth={3} size={28} /></span>
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
</style>
