# AutoGuessr
A price-guessing game with cars. 

## Pages
There are currently 5 pages in the game. In this section, we will go through each one. 

### Game Page
Main gameplay page with image carousel, stats and a guessDisplay.

### End page
Game over screen with options to go home or play again. Opens the card-draw screen depending on score.

### Auto-Cards page
View unlocked cards.

### Card-Draw page
Draw a new autocard. The rarity depends on the score that was achieved in the game.

## Tailwind
[Tailwind 3](https://tailwindcss.com/) is being used for styling.

## SV - Svelte CLI

AutoGuessr was built with Svelte 5, powered by [`sv`](https://github.com/sveltejs/cli). 

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
