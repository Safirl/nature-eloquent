import { Environment, Experience } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three";
import Sky from "./Sky";
import Cloud from "./Cloud";
import { RenderPass, UnrealBloomPass, type GLTF } from "three/examples/jsm/Addons.js";
import Grass from "./Grass";
import SelectiveBloom from "../plugins/baseExperience/utils/SelectiveBloom";
import RenderingLayers from "../common/RenderingLayers";
import FogVariables from "../common/Fog";
import InstancedMeshManager from "../interactions/InstancedMeshManager";
import InteractableInstancedMesh from "../interactions/InteractableInstancedMesh";

export default class GameEnvironment extends Environment {
	declare protected bloomDebugFolder: GUI;
	declare fogDebugFolder: GUI;
	declare camera: THREE.Camera;
	declare sunlightOffset: THREE.Vector3;

	declare sky: Sky;
	declare fog: THREE.Fog;
	declare cloud: Cloud;
	declare private grass: Grass;
	declare private pineTreesManager: InstancedMeshManager;

	declare private sunMesh: THREE.Mesh;
	declare private selectiveBloom: SelectiveBloom;
	declare private bloomPass: UnrealBloomPass;
	declare public renderScene: RenderPass;

	constructor(
		lightingEnvironmentMap?: THREE.CubeTexture<unknown> | undefined,
		useAsBackground?: boolean,
		backgroundEnvironmentMap?: THREE.CubeTexture
	) {
		super(lightingEnvironmentMap, useAsBackground, backgroundEnvironmentMap);
		this.sky = new Sky(0, this.debugFolder);
		this.setFog();
		this.setBloom();
		this.setForest();
		this.grass = new Grass();
		// this.cloud = new Cloud();
		// const bg = this.createBackground();
		// const sky = new THREE.Mesh(
		//     new THREE.SphereGeometry( 800 ),
		//     new THREE.MeshBasicMaterial( { map: bg, side: THREE.BackSide } )
		// );
		// this.scene.add( sky );
	}

	setFog() {
		this.fog = new THREE.Fog(FogVariables.color, 20, 225);
		this.scene.fog = this.fog;
		/**
		 * Add debugger
		 */
		if (this.debugFolder) {
			this.fogDebugFolder = this.debugFolder.addFolder("🌫️ fog");
			this.fogDebugFolder.open(false);
			this.fogDebugFolder.add(this.fog, "near").name("fog near").min(0).max(100).step(0.1);

			this.fogDebugFolder.add(this.fog, "far").name("fog far").min(0).max(1000).step(0.1);
		}
	}

	disableFog() {
		if (!this.fog) return;
		this.fog.color = new THREE.Color(0x00000000);
	}
	enableFog() {
		if (!this.fog) return;
		this.fog.color = new THREE.Color(FogVariables.color);
	}

	setSunlight(): void {
		const player = Experience.instance?.camera.instance;
		if (!player) return;
		this.camera = player;

		this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
		this.sunLight.castShadow = true;
		this.sunLight.shadow.camera.far = 25;
		this.sunLight.shadow.mapSize.set(2048 * 2, 2048 * 2);
		this.sunLight.shadow.radius = 2.5;
		this.sunLight.shadow.normalBias = 0.05;
		this.sunlightOffset = new THREE.Vector3(-45, 8.2, 22.95);
		this.sunLight.position.set(
			this.sunlightOffset.x,
			this.sunlightOffset.y,
			this.sunlightOffset.z
		);
		this.scene.add(this.sunLight);

		this.sunLight.shadow.camera.near = 1;
		this.sunLight.shadow.camera.far = 100;
		this.sunLight.shadow.camera.top = 45;
		this.sunLight.shadow.camera.right = 45;
		this.sunLight.shadow.camera.left = -45;
		this.sunLight.shadow.camera.bottom = -45;

		this.setSunPlane();

		/**
		 * Add debugger
		 */
		// this.sunLight.target =  this.camera
	}

	setForest() {
		const resource = this.experience.resources.items["pineModel"] as GLTF;
		this.pineTreesManager = new InstancedMeshManager(
			resource.scene.children[0] as THREE.Group,
			800,
			false
		);
		const count = 10;
		for (let i = 0; i < count; i++) {
			const randX = (Math.random() - 0.5) * i * 10;
			const randZ = (Math.random() - 0.5) * i * 10;
			this.pineTreesManager.add(new THREE.Vector3(randX, 0, randZ));
		}
	}

	setDebugObject(): void {
		super.setDebugObject();
		if (this.debug.active) {
			this.sunlightDebugFolder
				.add(this.sunLight.shadow.camera, "near")
				.name("sunlight shadow near")
				.min(1)
				.max(19)
				.step(0.1)
				.onChange(() => this.updateShadowMatrix());

			this.sunlightDebugFolder
				.add(this.sunLight.shadow.camera, "far")
				.name("sunlight shadow far")
				.min(1)
				.max(50)
				.step(0.1)
				.onChange(() => this.updateShadowMatrix());

			this.sunlightDebugFolder
				.add(this.sunLight.shadow.camera, "top")
				.name("shadow amplitude")
				.min(1)
				.max(200)
				.step(0.1)
				.onChange((v: number) => this.updateCameraShadowAmplitude(v));

			this.sunlightDebugFolder
				.add(this.sunLight.shadow, "radius")
				.name("sunlight shadow radius")
				.min(1)
				.max(20)
				.step(0.1)
				.onChange(() => this.updateShadowMatrix());
		}
	}

	updateShadowMatrix = () => {
		this.sunLight.shadow.camera.updateProjectionMatrix();
	};

	updateCameraShadowAmplitude(value: number) {
		this.sunLight.shadow.camera.top = value;
		this.sunLight.shadow.camera.right = value;
		this.sunLight.shadow.camera.left = -value;
		this.sunLight.shadow.camera.bottom = -value;
		this.updateShadowMatrix();
	}

	setSunPlane() {
		this.sunMesh = new THREE.Mesh(
			new THREE.CircleGeometry(),
			new THREE.MeshStandardMaterial({
				emissive: new THREE.Color(0xffffff),
				emissiveIntensity: 6,
			})
		);
		this.sunMesh.position.set(
			this.sunLight.position.x,
			this.sunLight.position.y,
			this.sunLight.position.z
		);
		this.sunMesh.lookAt(new THREE.Vector3());
		this.sunLight.attach(this.sunMesh);
	}

	setBloom() {
		if (!Experience.instance) return;

		const resolution = Experience.instance.sizes;
		this.bloomPass = new UnrealBloomPass(
			new THREE.Vector2(resolution.width, resolution.height),
			1.5,
			0.4,
			5,
		);
		Experience.instance?.renderer.addComposerPass(this.bloomPass, false);

		/**
		 * Add debugger
		 */
		if (this.debugFolder) {
			this.bloomDebugFolder = this.debugFolder.addFolder("🌄 Bloom");
			this.bloomDebugFolder.add(this.bloomPass, "enabled").name("Enabled");
			this.bloomDebugFolder
				.add(this.bloomPass, "strength")
				.name("Strength")
				.min(0.1)
				.max(5)
				.step(0.1);
			this.bloomDebugFolder
				.add(this.bloomPass, "radius")
				.name("Radius")
				.min(0.1)
				.max(5)
				.step(0.1);
			this.bloomDebugFolder
				.add(this.bloomPass, "threshold")
				.name("Threshold")
				.min(0)
				.max(1)
				.step(0.01);
		}
	}

	update() {
		if (this.grass) {
			this.grass.update();
		}
	}
}
