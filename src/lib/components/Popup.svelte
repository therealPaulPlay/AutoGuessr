<script>
    import { scale, fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import Button from "$lib/components/Button.svelte";
    import { X } from "lucide-svelte";
    let {
        children,
        z,
        title,
        closeFunction,
        color = "var(--white)",
        tall = false,
        small = false,
        minimalPadding = false,
        showCloseButton = true,
    } = $props();
</script>

<div
    class="fixed top-0 bottom-0 left-0 right-0 z-[99] popup-background flex justify-center items-center"
    style:z-index={z}
    transition:fade={{ duration: 150 }}>
    <div
        class="rounded-xl w-11/12 max-size relative {minimalPadding
            ? 'p-2'
            : 'p-8'}"
        style:max-height={tall ? "1150px" : small ? "400px" : ""}
        style:max-width={small ? "550px" : ""}
        style:background-color={color}
        transition:scale={{ start: 0.9, duration: 200, easing: cubicOut }}>
        {#if showCloseButton}
            <div
                class="absolute top-2 right-2 text-white z-10 border-8 border-white rounded-xl rounded-t-none rounded-r-none"
                style:background-color={color}
                style:border-color={color}>
                <Button
                    onclick={() => {
                        closeFunction?.();
                    }}>
                    <X strokeWidth={4} />
                </Button>
            </div>
        {/if}
        <h1
            class="absolute mt-5 mb-10 text-3xl font-bold w-3/4 overflow-hidden text-ellipsis py-1">
            {title}
        </h1>
        <div
            class="w-full h-full relative"
            style:padding-top={showCloseButton && title == ""
                ? "3.5rem"
                : "0rem"}>
            {@render children?.()}
        </div>
    </div>
</div>

<style>
    .popup-background {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .max-size {
        max-height: 750px;
        max-width: 800px;
    }
</style>