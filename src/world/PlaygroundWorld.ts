import { Experience } from "@plugins/baseExperience";
import { Environment } from "@plugins/baseExperience";
import { Floor } from "@plugins/baseExperience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { Actor } from "@plugins/baseExperience";
import { World } from "@plugins/baseExperience";
import * as THREE from "three";
import GameEnvironment from "./GameEnvironment";
import type GameExperience from "../GameExperience";

export default class Playground extends World {
	// declare experience: GameExperience;
	declare scene: Experience["scene"];
	declare environment: Environment;
	declare resources: Experience["resources"];
	declare floor: Floor;
	declare fox: Actor;
	declare layout: Actor;
	declare aster: Actor;
	declare forestModel: Actor;
	declare invisibleWallModel: Actor;

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
		// this.aster.setScale(10, 10, 10);

		this.forestModel = new Actor(
			"forestModel",
			this.resources.items.forestModel as GLTF,
			true,
			false,
			this.resources.items.forestModel as GLTF
		);

		this.invisibleWallModel = new Actor(
			"invisibleWallModel",
			this.resources.items.invisibleWallModel as GLTF,
			true,
			false,
			this.resources.items.invisibleWallModel as GLTF
		);

		this.invisibleWallModel.model.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				child.material.transparent = true;
				child.material.opacity = 0;
			}
		});

		// Add colisions
		const collisionManager = Experience.instance?.collisionManager;
		if (!collisionManager)
			throw new Error("Playground initialization failed: CollisionManager is not available.");
		collisionManager?.addCollisionObjects([this.floor]);
		collisionManager?.addCollisionObjects([this.layout]);
		collisionManager?.addCollisionObjects([this.invisibleWallModel]);
	}

	update() {
		if (this.fox) {
			this.fox.update();
		}
		const gameExperience = this.experience as GameExperience;
		if (gameExperience.menu) {
			gameExperience.menu.update();
		}
		if (this.environment) {
			this.environment.update();
		}
		if (this.aster) {
			this.aster.update();
		}
		// if (this.introductionSequence) this.introductionSequence.update();
	}
}
