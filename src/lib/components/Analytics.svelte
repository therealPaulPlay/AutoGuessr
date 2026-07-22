<script>
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { AlertCircle } from "lucide-svelte";
	import Button from "./Button.svelte";
	import { slide } from "svelte/transition";

	const GA_ID = "G-BXJL38P1X3";

	let showBanner = $state(false);

	function gtag() {
		window.dataLayer = window.dataLayer || [];
		dataLayer.push(arguments);
	}

	onMount(() => {
		// Check if the user has already accepted cookies
		const consent = localStorage.getItem("cookieConsent");

		if (consent === "true") loadGoogleAnalytics(true);
		else if (consent === "false") loadGoogleAnalytics(false);
		else {
			loadGoogleAnalytics(false);
			showBanner = true;
		}
	});

	function loadGoogleAnalytics(hasConsent) {
		try {
			setConsent(hasConsent, false); // Set consent before running gtag("js")
			gtag("js", new Date());
			gtag("config", GA_ID, {
				page_title: document.title,
				page_path: $page.url.pathname,
				cookie_domain: $page.url.hostname,
				cookie_flags: "SameSite=None; Secure",
			});
		} catch (error) {
			console.error("Error loading Google Analytics:", error);
		}
	}

	function setConsent(hasConsent, isUpdate = false) {
		const consentState = hasConsent ? "granted" : "denied";
		gtag("consent", isUpdate ? "update" : "default", {
			ad_storage: consentState,
			ad_personalization: consentState,
			ad_user_data: consentState,
			analytics_storage: consentState,
		});
	}

	function handleAccept() {
		localStorage.setItem("cookieConsent", "true");
		showBanner = false;
		setConsent(true, true);
	}

	function handleDeny() {
		localStorage.setItem("cookieConsent", "false");
		showBanner = false;
	}
</script>

<svelte:head>
	<script src="https://www.googletagmanager.com/gtag/js?id={GA_ID}" async></script>
</svelte:head>

{#if showBanner}
	<div
		role="alert"
		class="fixed w-fit m-4 bottom-0 bg-tanDark right-0 z-50 p-4 rounded-lg flex flex-col gap-3 max-w-96"
		transition:slide
	>
		<div class="flex flex-wrap gap-2 bg-tanLight p-2 rounded-md">
			<span class="text-wrap"
				>This website uses cookies according to its <a href="/legal" class="underline">privacy policy</a>.</span
			>
		</div>

		<div class="flex flex-wrap gap-3">
			<Button onclick={handleAccept} color="var(--green-button)" bgcolor="var(--green-button-dark)">Accept</Button>
			<Button onclick={handleDeny}>Only essential</Button>
		</div>
	</div>
{/if}
