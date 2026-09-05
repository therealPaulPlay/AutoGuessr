<script>
	import Button from "$lib/components/Button.svelte";
	import { goto } from "$app/navigation";
	import { Check, Clock, CalendarDays } from "lucide-svelte";

	const currentYear = new Date().getFullYear();
	const publishedDate = "September 5, 2026";

	const games = [
		{
			rank: 1,
			name: "OpenGuessr",
			tagline: "The best free alternative for most people",
			paragraphs: [
				"If you only try one game from this list, make it OpenGuessr. It's the most complete free GeoGuessr alternative right now.",
				"The singleplayer is endless-style: finish a round and the next one starts right away, no trip back to a menu, nothing breaking your flow. It makes \"just one more round\" dangerously easy. The main world map is auto-regenerated to use the latest Street View coverage, which keeps it permanently fresh, and it's curated toward interesting and urban locations instead of long empty highways. On top of that there are tens of thousands of community maps, held to tight quality guidelines, so the average map quality is the highest you'll find in a free game.",
				"Beyond the standard rounds there are some genuinely different modes. Country Guessr asks you to name only the country rather than the exact spot. There's also Image Guessr and Meta Guessr.",
				"Multiplayer is strong with rooms of up to 500 players, and the connection is the smoothest of the free options, powered by an in-house open-source system \"PlaySocket\". Hosts get moderation tools, so they can kick or mute players when needed. For extra chaos you can add restrictions to a room, like grayscale or NMPZ. For competitive players, there are ranked duels with proper elo and token rewards, there are free-to-enter tournaments with in-game prizes, plus a daily competition and hundreds of community-made competitions running at any time.",
				"The ad setup is super light with only one ad unit during gameplay, no ads in the menus. You don't need an account at all. There's still plenty of room to personalize your profile, with badges, pins, flags, and profile descriptions. The interface as a whole is consistent, great on both desktop and mobile, with handcrafted illustrations, composed music, and a clear focus on getting you into a round quickly.",
				"OpenGuessr is the second oldest game on this list (Geotastic is slightly older), and you can feel it in how refined it is.",
			],
			bestFor: "Pretty much everyone, from first-time players to daily competitors.",
		},
		{
			rank: 2,
			name: "AutoGuessr",
			tagline: "Guess the price of real cars on sale",
			featured: true,
			paragraphs: [
				"AutoGuessr is the one game here that isn't about finding a place. Instead of a location, you get a real car listing that is live on the market right now, taken from dealers across the US. You look through the photos, read the seller's description, check the specs and where the dealer is, and then guess the asking price. The game shows you the real number and scores you on how close you got.",
				"You start with 3 lives, shown as a little traffic light, and a perfect guess earns one back. Difficulty tiers from Easy to Hard keep both casual and brutal rounds available, and as you play you unlock AutoCards, a set of 30 collectible cards with iconic classic cars at different rarities. There's multiplayer as well.",
				"Because the listings are real, you end up learning something useful. After a few sessions you start to understand how mileage, trim level, model year, and region affect what a car costs. Don't be surprised if you catch yourself mentally pricing cars you pass in traffic.",
			],
			bestFor:
				"Players who want the guessing loop in a completely fresh setting, and anyone who has ever argued about what a used car should cost.",
		},
		{
			rank: 3,
			name: "WorldGuessr",
			tagline: "The duels-first option",
			paragraphs: [
				"WorldGuessr is best understood as a duels game, which it excels at. One-on-one matches are clearly the main focus, and if quick head-to-head rounds are what you're after, it's a solid pick. Singleplayer follows the traditional 5-round format, there's one daily challenge, and the map library is very large. One fun detail: you can use colorful names, which gives lobbies a bit of personality.",
				"There are slight catches. The main menu has ads, and a signup popup appears when you arrive. The game is a little light on features — no moderation tools for room hosts and no way to see which players have guessed already. A plus is the unranked duels feature, which allows for practicing just for fun.",
			],
			bestFor: "Players who mostly want fast duels and a big map pool, and who can live with the lighter feature set.",
		},
		{
			rank: 4,
			name: "Geotastic",
			tagline: "The feature powerhouse",
			paragraphs: [
				"Geotastic is the oldest game on this list, and it shows in the number of features. The focus is clearly on what professional players love: fast blitz duels, a genuinely good map editor, seasons, challenges with a proper challenge editor, and highscore hunts across all sorts of modes, including select-country rules and multiple-tries formats. A lot of these are genuinely innovative, and the challenge editor in particular is still one of the most flexible tools in the genre.",
				"The main downside is monetization. Many features sit behind a video ad or a donation goal, which can interrupt the flow of a session.",
			],
			bestFor: "Experienced and competitive players who want the biggest feature set for the classic mode they can find.",
		},
		{
			rank: 5,
			name: "City Guesser",
			tagline: "Walking videos instead of panoramas",
			paragraphs: [
				"City Guesser does something none of the other games here do. Instead of static Street View panoramas, it plays short walking videos filmed by real travelers around the world. You watch the camera move through a neighborhood for thirty seconds to a minute, picking up clues from signage, background conversations, vehicles, and architecture, and then you place your guess.",
				"The location database leans heavily toward popular tourist cities, which makes rounds easier but means you learn less about lesser-known parts of the world.",
			],
			bestFor: "Players who want motion and sound cues rather than static panoramas.",
		},
		{
			rank: 6,
			name: "Worldle",
			tagline: "The daily country silhouette",
			paragraphs: [
				"Worldle is basically the country-guessing version of the word game. Every day, every player in the world gets the same silhouette of a country. You have six guesses, and each wrong guess tells you the direction and distance to the right answer. It trains country recognition in a way no Street View game can.",
			],
			bestFor: "A daily geography habit.",
		},
		{
			rank: 7,
			name: "Globle",
			tagline: "Country guessing by proximity",
			paragraphs: [
				"Globle takes the daily country idea and removes the silhouette entirely. There's one secret country each day, and after every guess the globe colors your pick based on how close it is to the answer, hot for close, cool for far. Admittedly, this is a step removed from GeoGuessr-style play. It's more of a warm-cold puzzle than a location round. But the geographic intuition it builds carries straight over into Street View games, and if you make it a daily habit, you'll end up knowing the world map in more detail than most adults ever do.",
			],
			bestFor: "Sharpening your mental world map a little every day.",
		},
	];
</script>

<svelte:head>
	<title>The 7 best free GeoGuessr alternatives in {currentYear}</title>
	<meta
		name="description"
		content="Seven free GeoGuessr alternatives worth playing in {currentYear}, from polished panorama guessing to car prices. All unlimited, no subscription."
	/>
	<meta property="og:title" content="The 7 best free GeoGuessr alternatives in {currentYear}" />
	<meta
		property="og:description"
		content="Seven free guessing games that take the GeoGuessr idea in genuinely different directions, including one that swaps geography for car prices."
	/>
	<meta property="og:type" content="article" />
</svelte:head>

<article class="w-full flex justify-center px-4 pb-24">
	<div class="w-full max-w-screen-md">
		<!-- Hero -->
		<header class="pt-2 pb-10">
			<h1 class="font-bold text-4xl sm:text-5xl leading-tight text-black">
				The 7 best free GeoGuessr alternatives in {currentYear}
			</h1>
			<p class="mt-5 text-lg leading-relaxed text-black/70">
				GeoGuessr defined the genre, but its free tier is tight and the subscription adds up. Here are seven free
				guessing games that take the same core idea in genuinely different directions, including one that leaves maps
				behind entirely.
			</p>
			<div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-tanText">
				<span class="flex items-center gap-1.5"><CalendarDays size={16} />{publishedDate}</span>
				<span class="flex items-center gap-1.5"><Clock size={16} />5 min read</span>
			</div>
		</header>

		<!-- Quick answer -->
		<aside class="rounded-2xl bg-white p-6 sm:p-8 shadow-[0_6px_0_var(--default-shadow)] mb-10">
			<h2 class="font-bold text-2xl mb-3">Quick answer</h2>
			<p class="text-lg leading-relaxed text-black/80">
				The two free GeoGuessr alternatives worth trying first in {currentYear} are
				<strong class="text-black">OpenGuessr</strong>, the most polished free take on the classic Street View formula,
				and <strong class="text-black">AutoGuessr</strong>, which turns real car listings into a price guessing game.
				If you want something further from the original, <strong class="text-black">City Guesser</strong> uses walking
				videos and <strong class="text-black">Worldle</strong> gives you a daily country shape. None of them require a
				subscription.
			</p>
		</aside>

		<!-- Table of contents -->
		<nav class="mb-12 rounded-2xl bg-white p-6 sm:p-8 shadow-[0_6px_0_var(--default-shadow)]">
			<h2 class="font-bold text-2xl mb-4">On this page</h2>
			<ol class="divide-y divide-tanMedium">
				{#each games as game}
					<li>
						<a
							href="#{game.name.toLowerCase().replace(/\s+/g, '-')}"
							class="flex items-baseline gap-3 py-2.5 hover:underline underline-offset-4"
						>
							<span class="text-tanText font-bold text-lg w-5 shrink-0">{game.rank}</span>
							<span class="font-semibold text-lg">{game.name}</span>
							<span class="text-tanText text-sm max-sm:hidden">{game.tagline}</span>
						</a>
					</li>
				{/each}
			</ol>
		</nav>

		<!-- Intro -->
		<section class="mb-12">
			<h2 class="font-bold text-3xl mb-4 leading-snug">
				7 free GeoGuessr alternatives worth playing in {currentYear}
			</h2>
			<div class="space-y-4 text-lg leading-relaxed text-black/80">
				<p>
					GeoGuessr deserves credit for inventing a category. You get dropped somewhere on Earth, you look around for
					clues, and you guess where you are. Simple idea, with a long path to mastery, and you genuinely learn
					geography while playing. It's incredibly polished with amazing 3D graphics. The problem is the price. The free tier only gets you one daily challenge now, and a
					subscription runs about 48 USD a year for the basic plan. If you're a
					student, a teacher, or just someone who wants a round on their lunch break, paying that every year is hard to
					justify.
				</p>
				<p>
					Luckily the genre has grown a lot. Several free games now match parts of the paid product, and a few beat it
					in specific areas. One of the newer entries even drops geography entirely and has you
					guessing car prices instead. Here are seven free GeoGuessr alternatives worth your time in {currentYear}.
				</p>
			</div>
		</section>

		<!-- Games -->
		<div class="space-y-8">
			{#each games as game}
				<section
					id={game.name.toLowerCase().replace(/\s+/g, "-")}
					class="scroll-mt-24 rounded-2xl p-6 sm:p-8 {game.featured
						? 'bg-orange text-white shadow-[0_6px_0_var(--default-button-dark)]'
						: 'bg-white shadow-[0_6px_0_var(--default-shadow)]'}"
				>
					<div class="flex items-start gap-4">
						<div
							class="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-bold text-2xl {game.featured
								? 'bg-white/15 text-white'
								: 'bg-tanLight text-orange'}"
						>
							{game.rank}
						</div>
						<div class="min-w-0">
							<h2 class="font-bold text-2xl sm:text-3xl leading-tight">{game.name}</h2>
							<p class="text-lg mt-1 {game.featured ? 'text-white/80' : 'text-black/50'}">{game.tagline}</p>
						</div>
					</div>

					<div
						class="mt-5 space-y-4 text-lg leading-relaxed {game.featured ? 'text-white/90' : 'text-black/80'}"
					>
						{#each game.paragraphs as paragraph}
							<p>{paragraph}</p>
						{/each}
					</div>

					<!-- Best for -->
					<div
						class="mt-6 rounded-xl p-4 flex items-start gap-3 {game.featured
							? 'bg-white/15'
							: 'bg-tanLight'}"
					>
						<span class="shrink-0 mt-1 {game.featured ? 'text-white' : 'text-green'}"><Check size={22} /></span>
						<p class="text-base leading-relaxed">
							<span class="font-bold">Best for:</span>
							<span class={game.featured ? "text-white/90" : "text-black/80"}>{game.bestFor}</span>
						</p>
					</div>
				</section>
			{/each}
		</div>

		<!-- Verdict -->
		<section id="which-one" class="scroll-mt-24 mt-12 rounded-2xl bg-white p-6 sm:p-8 shadow-[0_6px_0_var(--default-shadow)]">
			<h2 class="font-bold text-3xl mb-4">Which one should you play?</h2>
			<p class="text-lg leading-relaxed text-black/80">
				For most people it's
				<a
					href="https://openguessr.com"
					target="_blank"
					rel="noopener noreferrer"
					class="font-bold text-orange underline underline-offset-4 hover:text-orangeDark transition">OpenGuessr</a
				>. The maps are the best in the free tier, there's more mode variety than anywhere else, and the multiplayer is the
				most sophisticated of the bunch. If you'd rather not look at another Street
				View panorama,
				<a href="/" class="font-bold text-orange underline underline-offset-4 hover:text-orangeDark transition"
					>AutoGuessr</a
				>
				is the standout. <strong class="text-black">Geotastic</strong> rewards veterans chasing the deepest feature set,
				and <strong class="text-black">Worldle</strong> and <strong class="text-black">Globle</strong> each teach you the
				map with a daily puzzle.
			</p>
		</section>

		<!-- Closing -->
		<section class="mt-12">
			<h2 class="font-bold text-3xl mb-4">Nothing to lose</h2>
			<p class="text-lg leading-relaxed text-black/80">
				Every game on this list is free and runs in your browser, so there's no commitment involved in trying any of
				them. Open whichever one sounds most like your thing, play until it stops being fun, and close the tab. If it
				clicks, it'll probably cost you more evenings than any subscription would have.
			</p>
		</section>

		<!-- Final CTA -->
		<div
			class="mt-12 rounded-2xl bg-white p-6 sm:p-8 shadow-[0_6px_0_var(--default-shadow)] flex flex-col sm:flex-row sm:items-center gap-6"
		>
			<div class="flex-1">
				<p class="font-bold text-2xl leading-tight">Start with a round of AutoGuessr</p>
				<p class="text-base text-tanText mt-1">Real listings, real prices. No account, completely free.</p>
			</div>
			<div class="shrink-0">
				<Button buttonHeight="4rem" buttonWidth="11rem" shadowHeight="0.4rem" onclick={() => goto("/")}>
					<span class="text-2xl font-semibold">Play free</span>
				</Button>
			</div>
		</div>
	</div>
</article>
