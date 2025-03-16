<script>
	import { browser } from "$app/environment";
	import { onDestroy, onMount } from "svelte";
	import * as THREE from "three";
	import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

	let scene, camera, renderer, carBody, springs, wheels, clock;
	let container;
	let loader;

	// Define size bounds
	const MIN_SIZE = 350; // Minimum size to keep model visible on phones
	const MAX_SIZE = 2000;

	function getResponsiveSize() {
		const viewportSize = Math.min(window.innerWidth, window.innerHeight);
		let scaledSize = MIN_SIZE;

		if (window.innerWidth > 768 && window.innerWidth <= 1280) {
			scaledSize = MIN_SIZE + (viewportSize - MIN_SIZE) * 0.5;
		} else if (window.innerWidth <= 768) {
			scaledSize = MIN_SIZE;
		} else if (window.innerWidth <= 1920) {
			scaledSize = MIN_SIZE + (viewportSize - MIN_SIZE) * 0.9;
		} else {
			scaledSize = MIN_SIZE + (viewportSize - MIN_SIZE) * 1;
		}

		const size = Math.min(Math.max(scaledSize, MIN_SIZE), MAX_SIZE);
		return size;
	}

	onMount(async () => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
		renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.BasicShadowMap; // For harder shadows
		clock = new THREE.Clock();

		renderer.setPixelRatio(window.devicePixelRatio);
		const size = getResponsiveSize();
		renderer.setSize(size, size);
		container.appendChild(renderer.domElement);

		// Lighting
		scene.add(new THREE.AmbientLight(0xffffff, 2.5)); // Reduced ambient light intensity

		// Add spotlight
		const spotlight = new THREE.SpotLight(0xffffff, 5);
		spotlight.position.set(6, 3, 6);
		spotlight.lookAt(4, -3, -2);
		spotlight.decay = 1;
		spotlight.distance = 50;
		spotlight.castShadow = true;
		spotlight.shadow.mapSize.width = 4096;
		spotlight.shadow.mapSize.height = 4096;
		scene.add(spotlight);

		// Add keylight
		const keyLight = new THREE.SpotLight(0xffffff, 7);
		keyLight.position.set(10, 1, 9);
		keyLight.lookAt(4, -3, -2);
		keyLight.decay = 1;
		scene.add(keyLight);

		// Add ground plane for shadow
		const groundGeometry = new THREE.PlaneGeometry(50, 50);
		const groundMaterial = new THREE.ShadowMaterial({
			transparent: true,
			color: "rgb(207, 175, 143)",
		});
		const ground = new THREE.Mesh(groundGeometry, groundMaterial);
		ground.receiveShadow = true;
		ground.rotation.x = -Math.PI / 2;
		ground.position.y = -2.075;
		scene.add(ground);

		camera.position.set(6, 0.2, 6);
		camera.lookAt(3.75, 0.5, -2);

		// Load loader (must be client side)
		const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
		loader = new GLTFLoader();

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
		renderer.setPixelRatio(window.devicePixelRatio);
	}

	onDestroy(() => {
		// Dispose resources
		if (renderer) renderer.dispose();
		if (scene) scene.clear();
		carBody = null;
		springs = null;
		wheels = null;

		// Remove event listener
		if (browser) {
			window.removeEventListener("resize", onWindowResize);
		}
	});
</script>

<!-- Images background -->
<div class="fixed left-0 right-0 bottom-0 top-0 z-[-1]">
	<!-- large bg's -->
	<img
		class="absolute right-0 xl:-bottom-5 -bottom-52 max-xl:bottom-0 xl:w-[1500px] xl:h-96 h-76 w-[1000px] max-md:w-96 max-md:bottom-80 select-none"
		src="/assets/img/decorations/grass.png"
		alt="grass"
	/>
	<img
		class="absolute right-2 -bottom-52 w-[1600px] h-96 opacity-75 max-xl:hidden select-none"
		src="/assets/img/decorations/stones.png"
		alt="stone"
	/>
	<img
		class="absolute min-[2200px]:right-[46rem] min-[1800px]:right-[23rem] lg:right-[10rem] right-0 min-[1921px]:bottom-64 min-[1800px]:bottom-40 bottom-32 xl:w-[1000px] md:w-[650px] w-[300px] xl:h-96 h-72 max-md:h-28 max-md:bottom-[26rem] select-none"
		src="/assets/img/decorations/fence.png"
		alt="fence"
	/>
	<!-- tires -->
	<img
		class="absolute right-[98rem] min-[2200px]:right-[108rem] bottom-6 w-80 h-52 select-none"
		src="/assets/img/decorations/tire_ground.png"
		alt="tire"
	/>
	<img
		class="absolute right-[85rem] min-[2200px]:right-[95rem] -bottom-5 w-96 h-72 select-none"
		src="/assets/img/decorations/tire_grass.png"
		alt="tire"
	/>
	<img
		class="absolute right-[86rem] min-[2200px]:right-[96rem] bottom-12 w-80 h-80 select-none"
		src="/assets/img/decorations/tire_leaning.png"
		alt="tire"
	/>
	<!-- tools -->
	<img
		class="absolute right-[79rem] min-[2200px]:right-[89rem] opacity-75 bottom-24 w-38 h-28 select-none"
		src="/assets/img/decorations/toolbox.png"
		alt="tool"
	/>
	<img
		class="absolute right-[60rem] bottom-3 w-18 h-15 select-none"
		src="/assets/img/decorations/tool.png"
		alt="tool"
	/>
	<!-- Clouds -->
	<img
		class="absolute min-[2200px]:right-[10rem] xl:right-8 min-[2200px]:top-[10rem] xl:top-28 min-[2200px]:w-[30rem] w-[26rem] h-52 opacity-75 max-xl:hidden select-none"
		src="/assets/img/decorations/big_cloud.png"
		alt="cloud"
	/>
	<img
		class="absolute -right-20 xl:top-96 w-80 h-40 opacity-85 max-xl:hidden select-none"
		src="/assets/img/decorations/small_cloud.png"
		alt="cloud"
	/>
</div>

<!-- Canvas Container for 3d model -->
<div
	bind:this={container}
	class="fixed bottom-0 max-w-screen max-h-screen bg-transparent max-md:mb-[21rem] max-xl:mb-[2rem] md:right-0 max-md:mr-2 right-1/2 translate-x-1/2 md:translate-x-0 z-[0] select-none"
></div>

<!-- Images Foreground -->
<div class="fixed left-0 right-0 bottom-0 top-0">
	<img
		class="absolute right-2 bottom-[10%] xl:w-72 xl:h-72 w-44 h-44 max-xl:hidden select-none"
		src="/assets/img/decorations/long_grass_right.png"
		alt="grass"
	/>
	<img
		class="absolute xl:right-96 right-52 -bottom-8 xl:w-64 xl:h-64 w-36 h-36 min-[1921px]:w-72 min-[1921px]:h-72 max-md:bottom-80 max-md:w-20 max-md:h-20 select-none"
		src="/assets/img/decorations/small_plant.png"
		alt="grass"
	/>
</div>

<!-- Gradient -->
<div
	class="fixed bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-defaultShadowDark to-transparent z-[-2] opacity-90 select-none"
></div>
