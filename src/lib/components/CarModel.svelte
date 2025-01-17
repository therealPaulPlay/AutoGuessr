<script>
	import { onDestroy, onMount } from "svelte";
	import * as THREE from "three";
	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

	let scene, camera, renderer, carBody, springs, wheels, clock;
	let container;
	const loader = new GLTFLoader();

	// Define size bounds
	const MIN_SIZE = 350; // Minimum size to keep model visible on phones
	const MAX_SIZE = 2000;

	function getResponsiveSize() {
		const viewportSize = Math.min(window.innerWidth, window.innerHeight);
		let scaledSize = MIN_SIZE;

		if (window.innerWidth > 768 && window.innerWidth <= 1024) {
			scaledSize = MIN_SIZE + (viewportSize - MIN_SIZE) * 0.5;
		} else if (window.innerWidth <= 768) {
		} else {
			scaledSize = MIN_SIZE + (viewportSize - MIN_SIZE) * 0.9;
		}

		const size = Math.min(Math.max(scaledSize, MIN_SIZE), MAX_SIZE);
		return size;
	}

	onMount(() => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
		renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.BasicShadowMap; // For harder shadows
		clock = new THREE.Clock();

		const size = getResponsiveSize();
		renderer.setSize(size, size);
		container.appendChild(renderer.domElement);

		// Lighting
		scene.add(new THREE.AmbientLight(0xffffff, 2.5)); // Reduced ambient light intensity

		// Add spotlight
		const spotlight = new THREE.SpotLight(0xffffff, 6.5);
		spotlight.position.set(6, 3, 6);
		spotlight.lookAt(4, -3, -2);
		spotlight.decay = 1;
		spotlight.distance = 50;
		spotlight.castShadow = true;
		spotlight.shadow.mapSize.width = 1024;
		spotlight.shadow.mapSize.height = 1024;
		scene.add(spotlight);

		// Add ground plane for shadow
		const groundGeometry = new THREE.PlaneGeometry(50, 50);
		const groundMaterial = new THREE.ShadowMaterial({
			transparent: true,
			color: "rgba(237,209,182)",
		});
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.receiveShadow = true;
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = -2.075;
		scene.add(ground);

		camera.position.set(6, 0.5, 6);
		camera.lookAt(3.75, 0.62, -2);

		loadModels();
		animate();
		window.addEventListener("resize", onWindowResize);
	});

	function loadModels() {
		// Create toon material
		const toonMaterial = new THREE.MeshToonMaterial({
			color: 0xffffff,
		});

		loader.load("/assets/models/body.glb", (gltf) => {
			carBody = gltf.scene;
			carBody.position.set(4, -1.7, -3);
			carBody.rotation.y = -Math.PI / 6;
			carBody.scale.set(1.85, 1.85, 1.85);
			carBody.traverse((child) => {
				if (child.isMesh) {
					child.castShadow = true;
					child.material = child.material.clone();
					child.material.roughness = 1;
				}
			});
			scene.add(carBody);
		});

		loader.load("/assets/models/springs.glb", (gltf) => {
			springs = gltf.scene;
			springs.position.set(4, -1.7, -3);
			springs.rotation.y = -Math.PI / 6;
			springs.scale.set(1.85, 1.85, 1.85);
			springs.traverse((child) => {
				if (child.isMesh) {
					child.castShadow = true;
					child.material = child.material.clone();
					child.material.roughness = 1;
				}
			});
			scene.add(springs);
		});

		loader.load("/assets/models/wheels.glb", (gltf) => {
			wheels = gltf.scene;
			wheels.position.set(4, -1.7, -3);
			wheels.rotation.y = -Math.PI / 6;
			wheels.scale.set(1.85, 1.85, 1.85);
			wheels.traverse((child) => {
				if (child.isMesh) {
					child.castShadow = true;
					child.material = child.material.clone();
					child.material.roughness = 1;
				}
			});
			scene.add(wheels);
		});
	}

	function animate() {
		requestAnimationFrame(animate);
		const time = clock.getElapsedTime();
		if (carBody) {
			const bodyPosY = -1.7 + Math.sin(time * 3) * 0.015;
			carBody.position.y = bodyPosY;
			if (springs) {
				const scaleFactor = 1 + Math.sin(time * 3) * 0.15;
				springs.scale.set(1 * scaleFactor, 1, 1);
			}
		}
		renderer.render(scene, camera);
	}

	function onWindowResize() {
		const size = getResponsiveSize();
		renderer.setSize(size, size);
		camera.aspect = 1;
		camera.updateProjectionMatrix();
	}

	onDestroy(() => {
		// Dispose resources
		if (renderer) renderer.dispose();
		if (scene) scene.clear();
		carBody = null;
		springs = null;
		wheels = null;

		// Remove event listener
		if (typeof window !== "undefined") {
			window.removeEventListener("resize", onWindowResize);
		}
	});
</script>

<div
	bind:this={container}
	class="fixed bottom-0 max-w-screen max-h-screen bg-transparent max-md:mb-[21rem] max-lg:mb-[2rem] md:right-0 max-md:mr-2 right-1/2 translate-x-1/2 md:translate-x-0"
></div>
