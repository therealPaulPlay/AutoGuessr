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
        tall = false,
        small = false,
        minimalPadding = false,
    } = $props();
</script>

<div
    class="fixed top-0 bottom-0 left-0 right-0 z-[99] popup-background flex justify-center items-center"
    style:z-index={z}
    transition:fade={{ duration: 150 }}>
    <div
        class="rounded-xl bg-white h-5/6 w-11/12 max-size relative overflow-hidden {minimalPadding
            ? 'p-1 px-2'
            : 'p-4 px-8'}"
        style:max-height={tall ? "1150px" : small ? "300px" : ""}
        style:max-width={small ? "550px" : ""}
        transition:scale={{ start: 0.9, duration: 200, easing: cubicOut }}>
        <div class="absolute top-2 right-2 text-white">
            <Button
                execFunction={() => {
                    closeFunction?.();
                }}>
                <X strokeWidth={4} />
            </Button>
        </div>
        <h1 class="mt-5 mb-10 text-3xl font-bold w-3/4 overflow-hidden text-ellipsis py-1">{title}</h1>
        <div class="w-full custom-height overflow-y-auto">
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

    .custom-height {
        height: calc(100% - 4.5rem);
    }
</style>
