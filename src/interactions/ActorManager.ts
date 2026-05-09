import { Actor, Experience, type LifeTimeObject } from "@plugins/baseExperience";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";

export default class ActorManager implements LifeTimeObject {
	public meshes: Actor[] = [];
	declare private resource: GLTF;
	public count = 0;
	declare private max;
	declare private experience: Experience;

	constructor(resource: GLTF, max = 500, hasCollisions = false) {
		if (!Experience.instance) return;
		this.experience = Experience.instance;
		this.count = 0;
		this.max = max;
		this.resource = resource;
	}

	add(position: THREE.Vector3) {
		if (this.count == this.max) {
			console.warn("maxium instances reached !");
			return;
		}
		console.log("resource", this.resource);
		const actor = new Actor("managed actor", this.resource, true, true);
		actor.setPosition(position.x, position.y, position.z);
		actor.animation.play(actor.animation.actions[0].name, true);
		actor.model.isInteractable = true;
		console.log(actor.model);
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
