import { Environment, Experience } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three";
import Sky from "./Sky";
import Cloud from "./Cloud";
import { RenderPass, type GLTF } from "three/examples/jsm/Addons.js";
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
	declare public renderScene: RenderPass;

	constructor(
		lightingEnvironmentMap?: THREE.CubeTexture<unknown> | undefined,
		useAsBackground?: boolean,
		backgroundEnvironmentMap?: THREE.CubeTexture
	) {
		super(
			lightingEnvironmentMap,
			useAsBackground,
			backgroundEnvironmentMap
		);
		this.sky = new Sky(0, this.debugFolder);
		this.setFog();
		this.setBloom();
		this.setForest();
		this.grass = new Grass();
		// this.cloud = new Cloud()
		// const bg = this.createBackground();
		// const sky = new THREE.Mesh(
		//     new THREE.SphereGeometry( 800 ),
		//     new THREE.MeshBasicMaterial( { map: bg, side: THREE.BackSide } )
		// );
		// this.scene.add( sky );
	}

	setFog() {
		this.fog = new THREE.Fog(FogVariables.color, 0, 120);
		this.scene.fog = this.fog;
		/**
		 * Add debugger
		 */
		if (this.debugFolder) {
			this.fogDebugFolder = this.debugFolder.addFolder("🌫️ fog");
			this.fogDebugFolder
				.add(this.fog, "near")
				.name("fog near")
				.min(0)
				.max(100)
				.step(0.1);

			this.fogDebugFolder
				.add(this.fog, "far")
				.name("fog far")
				.min(0)
				.max(1000)
				.step(0.1);
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
		// const dummy = resource.scene.children[0].children[0] as THREE.Mesh
		// console.log(resource.scene.children[0].children[0])
		// const mesh = new THREE.InstancedMesh(
		// 	dummy.geometry,
		// 	dummy.material,
		// 	1
		// );
		// this.experience.scene.add(mesh)
		// console.log(resource)
		// this.pineTreesManager = new InstancedMeshManager(resource.scene.children[0].children[0] as THREE.Mesh, 500, false)
		// const pineLeavesManager = new InstancedMeshManager(resource.scene.children[0].children[1] as THREE.Mesh, 500, false)
		// const count = 10
		// for (let i = 0; i < count; i++) {
		// 	const randX = (Math.random() - .5) * count;
		// 	const randZ = (Math.random() - .5) * count;
		// 	pineLeavesManager.add(new THREE.Vector3(randX, 0, randZ))
		// 	this.pineTreesManager.add(new THREE.Vector3(randX, 0, randZ))
		// }
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

	// setSunPlane() {
	// 	this.sunMesh = new THREE.Mesh(
	// 		new THREE.CircleGeometry(),
	// 		new THREE.MeshBasicMaterial()
	// 	);
	// 	this.sunMesh.position.set(
	// 		this.sunLight.position.x,
	// 		this.sunLight.position.y,
	// 		this.sunLight.position.z
	// 	);
	// 	this.sunMesh.lookAt(new THREE.Vector3());
	// 	// const sunLightWorldDirection
	// 	// this.sunMesh.rotation.set(this.sunLight.getWorldDirection()) this.sunLight.rotation.y, this.sunLight.rotation.z)
	// 	this.sunLight.attach(this.sunMesh);
	// }

	setSunPlane() {
		this.sunMesh = new THREE.Mesh(
			new THREE.CircleGeometry(),
			new THREE.MeshBasicMaterial()
		);
		this.sunMesh.position.set(
			this.sunLight.position.x,
			this.sunLight.position.y,
			this.sunLight.position.z
		);
		this.sunMesh.lookAt(new THREE.Vector3());
		this.sunLight.attach(this.sunMesh);
		this.sunMesh.layers.enable(RenderingLayers.bloom);
	}

	setBloom() {
		Experience.instance?.renderer.initializeComposer();
		//@ts-ignore
		this.renderScene = Experience.instance?.renderer.renderPass;
		this.selectiveBloom = new SelectiveBloom(
			this.renderScene,
			RenderingLayers.bloom
		);

		Experience.instance?.renderer.addComposerPass(this.renderScene, true);
		Experience.instance?.renderer.addComposerPass(
			this.selectiveBloom.getMixPass,
			true
		);
		Experience.instance?.renderer.addComposerPass(
			this.selectiveBloom.getOutputPass,
			true
		);
	}

	update() {
		if (this.grass) {
			this.grass.update();
		}

		this.disableFog();
		this.selectiveBloom.update();
		this.enableFog();
	}
}
