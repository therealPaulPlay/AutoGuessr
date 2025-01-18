import { Howl } from "howler";

export function playClickingSound(density = 100, length = 1) {
    const sound = new Howl({ src: ["/sounds/randomizer_wheel_click.webm"], volume: 0.25 });

    // Convert density to milliseconds (minimum delay between clicks)
    const minInterval = density; // Minimum delay between clicks
    const totalDuration = length * 1000; // Convert seconds to milliseconds
    const maxInterval = totalDuration / 10; // Initial slower interval for starting
    let elapsed = 0;

    function playClick() {
        if (elapsed >= totalDuration) return; // Stop after total duration

        sound.play();
        elapsed += minInterval;

        // Easing function for interval: starts slow, speeds up, then slows down
        const progress = elapsed / totalDuration;
        const easing = (1 - Math.cos(progress * Math.PI)) / 2; // Ease in-out formula
        const currentInterval = maxInterval * (1 - easing) + minInterval * easing;

        setTimeout(playClick, currentInterval);
    }

    playClick();

    setTimeout(() => {
        sound.play();
    }, 1000 * length + 750);
}