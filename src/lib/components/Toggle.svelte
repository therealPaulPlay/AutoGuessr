<script>
	import { Howl } from "howler";
	let { checked = $bindable() } = $props();
</script>

<label class="switch">
	<input
		type="checkbox"
		bind:checked={checked}
		onchange={() => {
			new Howl({ src: ["/sounds/short_click.webm"] }).play();
		}}
	/>
	<span class="switch-slider rounded-xl"></span>
</label>

<style>
	.switch {
		position: relative;
		width: 68px;
		height: 42px;
	}

	/* Hide default HTML checkbox */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.switch-slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 41px;
		background-color: var(--default-shadow);
		transition: 0.4s;
	}

	.switch-slider::before {
		position: absolute;
		content: "";
		height: 26px;
		width: 30px;
		left: 6px;
		bottom: 6px;
		top: 6px;
		transition: 0.25s;
		background-color: var(--default-button);
		border-radius: 0.45rem;
		z-index: 2;
	}

	.switch-slider::after {
		content: "";
		position: absolute;
		left: 6px;
		bottom: 6px;
		top: 6px;
		width: 30px;
		height: 30px;
		transition: 0.25s;
		background-color: var(--default-button-dark);
		border-radius: 0.45rem;
	}

	input:checked + .switch-slider::before,
	input:checked + .switch-slider::after {
		transform: translateX(26px);
	}
</style>
