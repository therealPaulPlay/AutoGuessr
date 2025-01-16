<script>
	import { onMount } from "svelte";
	import * as THREE from "three";
	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

	let scene, camera, renderer, carBody, springs, wheels, clock;
	let container;

	const loader = new GLTFLoader();

	onMount(() => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, 1, 1, 1000); // Fixed aspect ratio (1:1)
		renderer = new THREE.WebGLRenderer({ alpha: true });
		clock = new THREE.Clock();

		// Set the renderer size to 1500px x 1500px
		const size = 1500;
		renderer.setSize(size, size);
		container.appendChild(renderer.domElement);

		// Lighting
		scene.add(new THREE.AmbientLight(0xffffff, 3.25)); // Color + Lighting intensity

		// Add spotlight with brightness 500, positioned to point at the car
		// const spotlight = new THREE.SpotLight(0xffffff, 300, 100, Math.PI / 4, 0.1, 2);
		// spotlight.position.set(10, 5, 10);
		// spotlight.lookAt(4, -2.25, -3);
		// scene.add(spotlight);

		// Set initial camera position and view
		camera.position.set(6, 0, 6); // Adjust camera distance to better fit the car
		camera.lookAt(2.5, 0.62, -2);

		loadModels();
		animate();

		window.addEventListener("resize", onWindowResize);
	});

	function loadModels() {
		loader.load("/assets/models/body.glb", (gltf) => {
			carBody = gltf.scene;
			carBody.position.set(4, -2.25, -3);
			carBody.rotation.y = -Math.PI / 6;
			carBody.scale.set(1, 1, 1);
			scene.add(carBody);
		});

		loader.load("/assets/models/springs.glb", (gltf) => {
			springs = gltf.scene;
			springs.position.set(4, -2.25, -3);
			springs.rotation.y = -Math.PI / 6;
			springs.scale.set(1, 1, 1);
			scene.add(springs);
		});

		loader.load("/assets/models/wheels.glb", (gltf) => {
			wheels = gltf.scene;
			wheels.position.set(4, -2.25, -3);
			wheels.rotation.y = -Math.PI / 6;
			wheels.scale.set(1, 1, 1);
			scene.add(wheels);
		});
	}

	function animate() {
		requestAnimationFrame(animate);
		const time = clock.getElapsedTime();

		if (carBody) {
			const bodyPosY = -2.26 + Math.sin(time * 3) * 0.015;
			carBody.position.y = bodyPosY;

			if (springs) {
				const scaleFactor = 1 + Math.sin(time * 3) * 0.15;
				springs.scale.set(1 * scaleFactor, 1, 1);
			}
		}

		renderer.render(scene, camera);
	}

	function onWindowResize() {
		const size = 1500; // Fixed size to prevent distortion
		renderer.setSize(size, size);

		// Keep the camera's aspect ratio fixed
		camera.aspect = 1; // 1:1 aspect ratio
		camera.updateProjectionMatrix();
	}
</script>

<div bind:this={container} class="fixed bottom-0 right-0 w-[1500px] h-[1500px] bg-transparent"></div>
