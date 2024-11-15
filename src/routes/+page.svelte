<script>
    import Button from '../lib/components/Button.svelte';
</script>

<main class="flex flex-col w-full mt-5">
    <div class="flex content-center justify-center">
        <img class="w-[60vw] drop-shadow-[0px_10px_0px_rgba(231,_101,_49,_0.15)]" src="assets/svg/logo.svg" alt="Logo"/>
    </div>
    <div class="flex flex-row justify-start p-8 mt-5">
        <div class="flex flex-col">
            <div>
                <Button 
                color="var(--default-button)" 
                bgcolor="var(--default-button-dark)" 
                imageSize=4rem
                buttonHeight=10rem
                buttonWidth=20rem
                shadowHeight=0.5rem
                execFunction={() => console.log("Button pressed")}
                svg="assets/svg/play.svg"
                >
                    <img src="/assets/svg/play.svg" alt="play button" style:width="3rem" />
                </Button>
            </div>
            <div class="my-3">
                <Button 
                color="var(--green-button)" 
                bgcolor="var(--green-button-dark)" 
                imageSize=3rem
                buttonHeight=4rem
                buttonWidth=20rem
                shadowHeight=0.5rem
                execFunction={() => console.log("Button pressed")}
                >
                    <div class="flex flex-row items-center justify-between w-full px-2">
                        <span class="text-white font-bold text-4xl">AutoCards</span>
                        <img src="/assets/svg/autocards icon.svg" alt="" style:width="3rem"/>
                    </div>
                </Button>
        </div>
    </div>
    <div class="">
        
    </div>
</main>