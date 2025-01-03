<script>
    import { username, experience } from "$lib/stores/accountStore";
    import { signOut } from "$lib/utils/checkAuthStatus";
    import { accountPopup } from "$lib/stores/uiStore";
    import { LogOut } from "lucide-svelte";
    import Popup from "./Popup.svelte";
    import Button from "./Button.svelte";
</script>

{#if $accountPopup}
    <Popup
        title={"Hey, " + $username + "!"}
        small={true}
        closeFunction={() => {
            accountPopup.set(false);
        }}>
        <p class="text-base mt-20">
            You have <b>{$experience?.toLocaleString()}</b> experience.
        </p>
        <div class="flex flex-wrap gap-2 text-white mt-4">
            <Button
                buttonWidth="6rem"
                execFunction={() => {
                    window.open("https://openguessr.com", "_blank").focus();
                }}>Manage</Button>
            <Button
                buttonWidth="3.5rem"
                execFunction={() => {
                    signOut();
                    accountPopup.set(false);
                }}>
                <LogOut strokeWidth={2.5} />
            </Button>
        </div>
    </Popup>
{/if}
