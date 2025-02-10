<script>
	import { Howl } from "howler";

	let {
		color = "var(--default-button)",
		bgcolor = "var(--default-button-dark)",
		textColor = "white",
		buttonWidth,
		buttonHeight = "3.25rem",
		shadowHeight = "0.3rem",
		onclick,
		border = false,
		interactive = true,
		customClasses,
		children,
	} = $props();

	let calculatedButtonHeight = "calc(100% - " + shadowHeight + ")";
	let buttonStyle = $state();
	let buttonElement;

	export function click() {
		pressButtonDown();
		buttonElement.click();
		setTimeout(shiftButtonUp, 150);
	}

	function pressButtonDown() {
		buttonStyle = `translate: 0 ${shadowHeight}; background-color: ${color}; height: ${calculatedButtonHeight};`;
	}

	function shiftButtonUp() {
		buttonStyle = `translate: 0 0; background-color: ${color}; height: ${calculatedButtonHeight}`;
	}

	shiftButtonUp();
</script>

<div
	class="flex h-full relative hover:brightness-110 transition duration-200{customClasses ? ` ${customClasses}` : ''}"
	id="buttonOuterDiv"
	style:width={buttonWidth || "fit-content"}
	style:height={buttonHeight}
	style:color={textColor}
>
	<button
		bind:this={buttonElement}
		class="rounded-lg z-10 ease-out duration-150 px-3 w-full flex items-center justify-center box-border bg-orange font-medium {border
			? 'border-white border-4'
			: ''} {interactive ? '' : '!pointer-events-none'}"
		style={buttonStyle}
		onpointerup={shiftButtonUp}
		onpointerdown={pressButtonDown}
		onpointerout={shiftButtonUp}
		ontouchstart={pressButtonDown}
		ontouchend={shiftButtonUp}
		ontouchcancel={shiftButtonUp}
		onclick={() => {
			new Howl({ src: ["/sounds/button_click.webm"] }).play();
			onclick?.();
		}}
	>
		{@render children?.()}
	</button>
	<!-- Shadow -->
	<div
		class="rounded-lg absolute w-full box-border {border ? 'border-white border-4' : ''}"
		style="height: calc(100% - {shadowHeight}"
		style:background-color={bgcolor}
		style:margin-top={shadowHeight}
	></div>
</div>
