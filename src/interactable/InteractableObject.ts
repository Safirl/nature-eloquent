import { Actor, Experience } from "@plugins/baseExperience";
import { SkeletonUtils, type GLTF } from "three/examples/jsm/Addons.js";
import Player from "../camera/Player";
import * as THREE from "three";



/**
 * 
 * 
 * This code is legacy. It shouldn't be used
 * 
 * 
 */


export default class InteractableObject extends Actor {
	declare player: Player;
	declare threshold: number;

	constructor(
		name: string,
		resource: GLTF,
		makeUnique: boolean = false,
		makeMaterialsUnique: boolean = false,
		collisionResource?: GLTF
	) {
		super(
			name,
			resource,
			makeUnique,
			makeMaterialsUnique,
			collisionResource
		);
		const player = Experience.instance?.camera as Player;
		if (!player) return;
		this.player = player;
		this.threshold = 5;
	}

	init = () => { };
	destroy = () => { };

	hideObject() {
		this.model.visible = false;
	}

	update(): void {
		if (!this.player) {
			return;
		}
		const distance = this.player.instance.position.distanceTo(
			this.model.position
		);
		if (distance < this.threshold) {
			this.player.setClosestObject(this);
		} else if (distance > this.threshold) {
			if (this.player instanceof Player)
				this.player.clearClosestObject(this);
		}
	}
	setModel(makeUnique: boolean, makeMaterialsUnique: boolean): void {
		if (makeUnique) this.model = SkeletonUtils.clone(this.resource.scene);
		else this.model = this.resource.scene;

		this.model.traverse((child: any) => {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
				child.receiveShadow = true;
				const material = child.material as THREE.Material;

				material.side = THREE.FrontSide;
				material.alphaTest = 0.5;
				material.transparent = false;
				material.depthWrite = true;
			}
		});
		this.scene.add(this.model);
	}
}
