import { Actor } from "@plugins/baseExperience";
import type { GLTF } from "three/examples/jsm/Addons.js";

export default class PlaceableObject extends Actor {
	constructor(name: string, resource: GLTF) {
		super(name, resource);
	}

	pickObject() {}

	getName(): string {
		return this.name;
	}

	destroy = () => {};
}
