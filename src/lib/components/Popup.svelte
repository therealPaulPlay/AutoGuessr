<script>
    import { scale, fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing"
    import Button from "$lib/components/Button.svelte";
    import { X } from "lucide-svelte";
    let { children, z, title, closeFunction } = $props();
</script>

<div
    class="fixed top-0 bottom-0 left-0 right-0 z-[99] popup-background flex justify-center items-center"
    style:z-index={z}
    transition:fade="{{ duration: 150 }}"
>
    <div 
        class="rounded-xl bg-white h-5/6 w-5/6 max-size relative p-4 px-8"
        transition:scale="{{ start: 0.9, duration: 200, easing: cubicOut }}"
    >
        <div class="absolute top-2 right-2 text-white">
            <Button execFunction={() => {
                closeFunction?.();
            }}>
                <X strokeWidth={4} />
            </Button>
        </div>
        <h1 class="mt-5 mb-10 text-4xl font-bold">{title}</h1>
        <div class="w-full overflow-y-auto">
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