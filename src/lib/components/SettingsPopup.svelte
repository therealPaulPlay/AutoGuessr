<script>
    import { settingsPopup } from "$lib/stores/uiStore";
    import Popup from "./Popup.svelte";
    import Toggle from "./Toggle.svelte";
    import Button from "./Button.svelte";
    import { Scan } from "lucide-svelte";
</script>

<Popup
    title="Settings"
    small={true}
    closeFunction={() => {
        settingsPopup.set(false);
    }}>
    <div class="flex h-full items-end mt-20">
        <div class="h-4/6 w-full p-4 flex flex-col gap-5">
            <div class="flex items-center gap-10 justify-between">
                <label for="volume-slider" class="text-base font-semibold"
                    >Volume</label>
                <div class="w-1/2">
                    <input
                        type="range"
                        id="volume-slider"
                        min="0"
                        max="100"
                        value="50"
                        step="10"
                        class="slider" />
                </div>
            </div>
            <div class="flex items-center gap-10 justify-between">
                <label for="something" class="text-base font-semibold"
                    >Something</label>
                <div class="w-1/2 flex justify-center">
                    <Toggle />
                </div>
            </div>
            <div class="flex items-center gap-10 justify-between">
                <label for="fullscreen" class="text-base font-semibold"
                    >Fullscreen</label>
                <div class="w-1/2 flex justify-center">
                    <Button
                        color="var(--default-button)"
                        bgcolor="var(--default-button-dark)"
                        execFunction={() => {
                            // Toggle on/off fullscreen
                            if (document.fullscreenElement) {
                                document.exitFullscreen();
                            } else {
                                document.documentElement.requestFullscreen();
                            }
                        }}>
                        <Scan strokeWidth={3} color="var(--white)" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
</Popup>
