<script>
    import { page } from "$app/stores";
</script>

<div class="flex justify-center items-center">
    <h1 class="font-bold text-xl">{$page.status}: {$page.error.message}</h1>
</div>