<script>
    import { page } from "$app/stores";
    import { ArrowRightCircle } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
</script>

<div class="flex flex-col items-center h-[80dvh] justify-around">
    <div class="">
        <h1 class="text-[12rem] text-orange leading-none text-center">
            {$page.status}
        </h1>
        <h1 class="font-bold text-5xl text-orange text-center">
            {$page.error.message}
        </h1>
    </div>
    <Button
        buttonWidth="12rem"
        buttonHeight="4rem"
        color="var(--green-button)"
        bgcolor="var(--green-button-dark)"
        onclick={() => goto("/")}>
        <span
            class="text-white text-xl font-medium flex items-center justify-center gap-2">
            <div class="scale-x-[-1]">
                <ArrowRightCircle strokeWidth={3} />
            </div>
            Main page</span>
    </Button>
</div>