import { Actor, Experience, type LifeTimeObject } from "@plugins/baseExperience";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import PlaceableObject from "../interactable/placeableObject";

export default class ActorManager implements LifeTimeObject {
	public meshes: PlaceableObject[] = [];
	declare private resource: GLTF;
	public count = 0;
	declare private max;
	declare private experience: Experience;
	declare private animationDuration: number | undefined;

	constructor(resource: GLTF, max = 500, animationDuration?: number, hasCollisions = false) {
		if (!Experience.instance) return;
		this.experience = Experience.instance;
		this.count = 0;
		this.max = max;
		this.resource = resource;
		this.animationDuration = animationDuration;
	}

	add(position: THREE.Vector3) {
		if (this.count == this.max) {
			console.warn("maxium instances reached !");
			return;
		}
		console.log("resource", this.resource);
		const actor = new PlaceableObject("managed actor", this.resource);
		actor.setPosition(position.x, position.y, position.z);
		actor.model.rotateY(Math.random() * 2 * Math.PI);
		actor.spawnAnimate(this.animationDuration);
		// if (actor.animation && actor.animation.actions.length > 0) {
		// 	actor.animation.play(actor.animation.actions[0].name, true);
		// }
		actor.model.isInteractable = true;
		this.meshes.push(actor);
		this.count++;
	}

	init = () => {};
	update = () => {
		this.meshes.forEach((m) => {
			m.update();
		});
	};
	destroy = () => {
		this.meshes.forEach((m) => {
			m.destroy();
		});
	};
}
