<script>
	import { onMount } from "svelte";
	import * as THREE from "three";
	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

	let scene, camera, renderer, carBody, springs, wheels, clock;
	let container;

	const loader = new GLTFLoader();

	onMount(() => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
		renderer = new THREE.WebGLRenderer({ alpha: true });
		clock = new THREE.Clock();
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

		// Lighting
		scene.add(new THREE.AmbientLight(0xffffff, 13)); // Reduce ambient light to avoid overexposure

		// Camera positioning (x, y, z as vector3)
		camera.position.set(5, 1, 5);
		camera.lookAt(2, 0, -2);

		loadModels();
		animate();
	});

	// Load models
	function loadModels() {
		loader.load("/assets/models/body.glb", (gltf) => {
			carBody = gltf.scene;
			carBody.position.set(4, -2.25, -3); // Positioned lower in the scene
			carBody.rotation.y = -Math.PI / 6; // Slightly rotated left
			carBody.scale.set(1, 1, 1); // Set the car to a larger size (1x scale)

			// Restore the original color and materials for the car body
			carBody.traverse((child) => {
				if (child.isMesh) {
					child.material.color.set(0x888888); // Default color
					child.material.emissive.set(0x111111); // Slight emissive effect for better lighting
				}
			});

			scene.add(carBody);
		});

		loader.load("/assets/models/springs.glb", (gltf) => {
			springs = gltf.scene;
			springs.position.set(4, -2.25, -3); // Positioned near the body
			springs.rotation.y = -Math.PI / 6; // Same rotation as body
			springs.scale.set(1, 1, 1); // Make springs the same size as the body
			scene.add(springs);
		});

		loader.load("/assets/models/wheels.glb", (gltf) => {
			wheels = gltf.scene;
			wheels.position.set(4, -2.25, -3); // Positioned just below the springs
			wheels.rotation.y = -Math.PI / 6; // Same rotation as body
			wheels.scale.set(1, 1, 1); // Same scale as body and springs
			scene.add(wheels);
		});
	}

	// Animation loop
	function animate() {
		requestAnimationFrame(animate);
		const time = clock.getElapsedTime();

		// Animate body movement
		if (carBody) {
			const bodyPosY = -2.25 + Math.sin(time * 1.5) * 0.02; // Body moves up and down
			carBody.position.y = bodyPosY;

			// Animate springs scaling
			if (springs) {
				const scaleFactor = 1 + Math.sin(time * 1.5) * 0.02; // Sync with body movement
				springs.scale.set(1 * scaleFactor, 1, 1);
			}
		}

		renderer.render(scene, camera);
	}
</script>

<div bind:this={container} class="absolute top-0 right-0 bottom-0 left-0 bg-transparent"></div>
