<script>
    import Button from '../lib/components/Button.svelte';
</script>

<main class="flex flex-col w-full mt-8">
    <div class="flex content-center justify-center">
        <img class="w-[60vw] drop-shadow-[0px_10px_0px_rgba(231,_101,_49,_0.15)]" src="assets/svg/logo.svg" alt="Logo"/>
    </div>
    <div class="flex flex-row justify-start">
        <div class="w-1/3 p-8">
            <div class="m-24">
                <Button 
                color="orange" 
                bgcolor="orangeDark" 
                w="10" 
                h="10" 
                m="24" 
                svg="assets/svg/play.svg"
            />
            </div>
        </div>
        <div class="w-2/3">
            car
        </div>
    </div>
</main>