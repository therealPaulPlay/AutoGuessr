<script>
	import { Howl } from "howler";
	let { sliderMin = 0, sliderMax = 500_000, guessValue = $bindable(sliderMin), children } = $props();

	const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
	let restrictedGuess = $derived(clamp(guessValue, sliderMin, sliderMax));

	// Initialize the Howl sound instance for the coin click
	const coinClickSound = new Howl({ src: ["/sounds/price_click.webm"], volume: 0.25 });

	// Time tracking to ensure minimum gap between sounds
	let lastSoundTime = 0;
	const MIN_SOUND_GAP = 50; // Minimum gap in milliseconds

	$effect(() => {
		guessValue = restrictedGuess;
	});

	function formatedGuess() {
		return "$" + restrictedGuess.toLocaleString();
	}

	function playCoinClick() {
		const now = Date.now();
		if (now - lastSoundTime >= MIN_SOUND_GAP) {
			coinClickSound.play();
			lastSoundTime = now;
		}
	}

	function preventNonNumericalInput(e) {
		const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"];
		if (allowedKeys.includes(e.key)) return;
		if (!e.key.match(/^[0-9]$/)) e.preventDefault(); // For other keys, only allow numbers
	}

	function selectAllText(e) {
		e.target.select();
	}

	let inputFocused = $state(false);
</script>

<div
	class="w-full flex items-center h-[4.2rem] rounded-lg bg-tanLight p-2 drop-shadow-[0_0.3rem_0_var(--white-shadow)] gap-2"
>
	<div class="grow-[2]">
		<input
			type="range"
			step="1"
			min={sliderMin}
			max={sliderMax}
			bind:value={guessValue}
			oninput={playCoinClick}
			class="slider w-full"
		/>
	</div>
	<div
		class="flex items-center justify-center relative bg-white text-xl p-2 rounded-md h-full text-orange font-bold min-w-40 max-md:min-w-32 transition {inputFocused
			? '!bg-orange'
			: ''}"
		class:default-number-width={sliderMax > 1_000_000}
	>
		<span
			class="w-full h-full bg-transparent text-center custom-vertical-align {inputFocused
				? 'text-white'
				: ''} transition">{formatedGuess()}</span
		>
		<input
			type="number"
			maxlength="8"
			bind:value={guessValue}
			onchange={() => {
				formatedGuess();
				playCoinClick();
			}}
			onkeydown={preventNonNumericalInput}
			onclick={selectAllText}
			onfocus={() => {
				inputFocused = true;
			}}
			onfocusout={() => {
				inputFocused = false;
			}}
			class="absolute w-full h-full"
			style="opacity: 0;"
		/>
	</div>
</div>

<style>
	.custom-vertical-align {
		line-height: 35px;
	}

	.default-number-width {
		min-width: 10rem;
	}

	/* make it smaller for phone screen */
	@media (max-width: 768px) {
		.default-number-width {
			min-width: 8.5rem;
		}
	}
</style>
