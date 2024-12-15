<script>
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
    import { score } from "$lib/stores/gameStore";

    let previousPB = 42;
</script>

<content class="flex flex-col items-center justify-center h-full">
    <h1 class="text-8xl font-bold text-orange mb-10">Game Over!</h1>
    <p class="text-base mb-20">
        You were able to get <span class="text-green font-bold"
            >{$score}</span
        >
        correct guess{$score <= 1 ? "" : "es"}! Your previous personal
        best was <span class="text-orange font-bold">{previousPB}.</span>
    </p>
    <div class="flex gap-10">
        <Button
            buttonHeight="4rem"
            buttonWidth="14rem"
            shadowHeight="0.5rem"
            color="var(--green-button)"
            bgcolor="var(--green-button-dark)"
            execFunction={() => {
                goto("/game");
            }}
        >
            <span class="text-white font-bold text-3xl">Play again</span>
        </Button>
        <Button
            buttonHeight="4rem"
            buttonWidth="14rem"
            shadowHeight="0.5rem"
            execFunction={() => {
                goto("/");
            }}
        >
            <span class="text-white font-bold text-3xl">Home</span>
        </Button>
    </div>
</content>
