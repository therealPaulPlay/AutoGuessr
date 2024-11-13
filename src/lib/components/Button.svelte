<script>
    let { color, bgcolor, w, h, m, svg } = $props();
</script>

<div class="flex flex-row items-center">
    <button class="bg-{color} rounded-lg z-10 active:translate-y-1 ease-out duration-300">
        <img class="w-{w} m-{m}" src="{svg}" alt="Back arrow"/>
    </button>
    <div class="bg-{bgcolor} rounded-lg absolute translate-y-1">
        <div class="w-{w} h-{h} m-{m}"></div>
    </div>
</div>