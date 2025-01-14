<script>
	import maplibregl from "maplibre-gl";
	import { onMount } from "svelte";

	let { coordinates } = $props();

	onMount(() => {
		let longitude = coordinates[1].toFixed(5);
		let latitude = coordinates[0].toFixed(5);

		const map = new maplibregl.Map({
			style: "https://tiles.openfreemap.org/styles/liberty",
			center: [longitude, latitude],
			zoom: 9.5,
			container: "map",
			attributionControl: false,
			minZoom: 1,
			maxZoom: 12,
		});

		map.on("load", () => {
			map.addLayer({
				id: "circle-layer",
				type: "circle",
				source: {
					type: "geojson",
					data: {
						type: "Feature",
						properties: {},
						geometry: {
							type: "Point",
							coordinates: [longitude, latitude],
						},
					},
				},
				paint: {
					"circle-radius": 20,
					"circle-color": "#e76531",
					"circle-opacity": 0.3,
					"circle-stroke-width": 2,
					"circle-stroke-color": "#e76531",
				},
			});
		});
	});
</script>

<div id="map" class="h-80 w-full overflow-clip"></div>
