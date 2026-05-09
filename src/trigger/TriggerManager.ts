import { EventEmitter, Experience } from "@plugins/baseExperience";
import type { FirstPersonCameraOctree } from "@plugins/firstPersonCamera";
import * as THREE from "three";
import SceneManager from "../scene/SceneManager";
import Menu from "../menu";
import type GameExperience from "../GameExperience";

type TriggerZone = {
	box: THREE.Box3;
	mesh: THREE.Mesh;
	helper?: THREE.Box3Helper;
	isInZone: boolean;
	onEnter: () => void;
};

export default class TriggerManager extends EventEmitter {
	declare experience: GameExperience;
	declare allTriggers: TriggerZone[];
	declare sceneManager: SceneManager;

	constructor(menu: Menu) {
		super();
		if (!Experience.instance) throw new Error("TriggerManager: Experience not initialized");
		this.experience = Experience.instance as GameExperience;
		this.allTriggers = [];
		this.sceneManager = this.experience.sceneManager;

		this.init();
		this.setupDebug();
	}

	init() {
		// La porte de la chambre
		this.createTriggerZone({ x: 2, y: 2, z: 1 }, { width: 1, height: 3, depth: 2 }, () =>
			this.sceneManager.addActiveStep(10)
		);
		// Entrée de la première clairière
		this.createTriggerZone({ x: 9, y: 2, z: -61 }, { width: 1, height: 5, depth: 2 }, () =>
			this.sceneManager.addActiveStep(11)
		);
		// Exit clairière
		this.createTriggerZone({ x: 44, y: 2, z: -59 }, { width: 1, height: 5, depth: 2 }, () =>
			this.sceneManager.addActiveStep(16)
		);
		// orage chemin droite
		this.createTriggerZone({ x: 79, y: 9, z: -44 }, { width: 1, height: 5, depth: 2 }, () =>
			this.sceneManager.addActiveStep(99)
		);

		// orage chemin gauche
		this.createTriggerZone({ x: 74, y: 8, z: -79 }, { width: 1, height: 5, depth: 2 }, () =>
			this.sceneManager.addActiveStep(99)
		);

		// Entrée de la deuxième clairière
		this.createTriggerZone({ x: 100, y: 11, z: -12 }, { width: 1, height: 5, depth: 2 }, () =>
			this.sceneManager.addActiveStep(19)
		);

		// // **** OLD - Entrée des deux chemins (lighting -> storm)
		// this.createTriggerZone({ x: 44, y: 2, z: -59 }, { width: 1, height: 5, depth: 2 }, () => this.sceneManager.addActiveStep(99));
		// this.createTriggerZone({ x: 45, y: 2, z: -59 }, { width: 1, height: 5, depth: 2 }, () => this.sceneManager.addActiveStep(18));
	}

	createTriggerZone(
		position: { x: number; y: number; z: number },
		size: { width: number; height: number; depth: number },
		callbackOnEnter: () => void
	) {
		const geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
		const material = new THREE.MeshBasicMaterial();
		material.transparent = true;
		material.opacity = 0;

		const triggerZone = new THREE.Mesh(geometry, material);
		triggerZone.position.set(position.x, position.y, position.z);
		this.experience.scene.add(triggerZone);

		const triggerZoneBox = new THREE.Box3().setFromObject(triggerZone);

		this.allTriggers.push({
			box: triggerZoneBox,
			mesh: triggerZone,
			isInZone: false,
			onEnter: callbackOnEnter,
		});

		return triggerZone;
	}

	removeTriggerZone(triggerZone: THREE.Mesh) {
		this.experience.scene.remove(triggerZone);

		triggerZone.geometry.dispose();
		triggerZone.material.dispose();
	}

	checkTrigger(playerBox: THREE.Box3, triggerBox: TriggerZone) {
		const isIntersecting = triggerBox.box.intersectsBox(playerBox);

		if (isIntersecting && !triggerBox.isInZone) {
			triggerBox.isInZone = true;
			triggerBox.onEnter();
			this.removeTriggerZone(triggerBox.mesh);
			this.allTriggers = this.allTriggers.filter((t) => t !== triggerBox);
		} else if (!isIntersecting && triggerBox.isInZone) {
			triggerBox.isInZone = false;
		}
	}

	update() {
		const camera = this.experience.camera as FirstPersonCameraOctree;
		for (const trigger of this.allTriggers) {
			trigger.box.setFromObject(trigger.mesh);
			this.checkTrigger(camera.playerBox, trigger);
		}
	}

	private setupDebug() {
		if (!this.experience.debug.active) return;

		const debugFolder = this.experience.debug.ui.addFolder("Triggers");

		for (const [index, trigger] of this.allTriggers.entries()) {
			const material = trigger.mesh.material as THREE.MeshBasicMaterial;

			material.wireframe = true;
			material.color.set(0xff0000);
			material.opacity = 0.3;

			const folder = debugFolder.addFolder(`Trigger ${index}`);

			folder.add(trigger.mesh.position, "x").min(-200).max(200).step(1);

			folder.add(trigger.mesh.position, "y").min(-50).max(50).step(0.1);

			folder.add(trigger.mesh.position, "z").min(-200).max(200).step(1);
		}
	}
}
