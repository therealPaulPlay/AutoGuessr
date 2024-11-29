<script>
    import Button from '../lib/components/Button.svelte';
    import Tab from '../lib/components/Tab.svelte';
    
</script>

<main class="flex flex-col w-full mt-5">
    <div class="flex content-center justify-center">
        <img class="w-[60vw] drop-shadow-[0px_10px_0px_rgba(231,_101,_49,_0.15)]" src="assets/svg/logo.svg" alt="Logo"/>
    </div>
    <div class="flex flex-row justify-start p-8 mt-5">
        <div class="flex flex-col overflow-clip">
            <!-- Difficulties -->
            <div class="flex flex-row max-w-64 ml-2">
                <Tab color="var(--green-button)">
                    <span class="text-2xl font-medium">Beginner</span>
                </Tab>
                <Tab color="var(--default-button)">
                    <span class="text-2xl font-medium">Advanced</span>
                </Tab>
                <Tab color="rgb(52, 49, 49)">
                    <span class="text-2xl font-medium">Expert</span>
                </Tab>
            </div>
            <div>
                <Button 
                buttonHeight=10rem
                buttonWidth=21rem
                shadowHeight=0.5rem
                execFunction={() => location.href = "/game"}
                >
                    <img src="/assets/svg/play.svg" alt="play button" style:width="3rem" />
                </Button>
            </div>
            <div class="my-3">
                <Button 
                color="var(--green-button)" 
                bgcolor="var(--green-button-dark)" 
                buttonHeight=4rem
                buttonWidth=21rem
                shadowHeight=0.5rem
                execFunction={() => location.href = "/auto-cards"}
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