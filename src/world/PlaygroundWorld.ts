import { Experience } from "@plugins/baseExperience";
import { Environment } from "@plugins/baseExperience";
import { Floor } from "@plugins/baseExperience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { Actor } from "@plugins/baseExperience";
import { World } from "@plugins/baseExperience";
import * as THREE from "three";
import GameEnvironment from "./GameEnvironment";
import Menu from "../menu";

export default class Playground extends World {
	declare experience: Experience;
	declare scene: Experience["scene"];
	declare environment: Environment;
	declare resources: Experience["resources"];
	declare floor: Floor;
	declare fox: Actor;
	declare public menu: Menu;
	declare layout: Actor;

	init() {
		super.init();
		this.floor = new Floor();
		this.environment = new GameEnvironment(
			this.resources.items.environmentMapTexture1 as THREE.CubeTexture,
			true
		);

		this.layout = new Actor(
			"layoutModel",
			this.resources.items.layoutModel as GLTF,
			true,
			false,
			this.resources.items.layoutModel as GLTF
		);
		// this.layout.model;
		this.layout.setScale(1, 1, 1);

		this.menu = new Menu();

		// Add colisions
		const collisionManager = Experience.instance?.collisionManager;
		if (!collisionManager)
			throw new Error("Playground initialization failed: CollisionManager is not available.");
		collisionManager?.addCollisionObjects([this.floor]);
		collisionManager?.addCollisionObjects([this.layout]);
	}

	getMenu(): Menu {
		return this.menu;
	}

	update() {
		if (this.fox) {
			this.fox.update();
		}
		if (this.menu) {
			this.menu.update();
		}
		if (this.environment) {
			this.environment.update();
		}
	}
}
