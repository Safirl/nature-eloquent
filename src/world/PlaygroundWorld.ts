import { Experience } from "@plugins/baseExperience";
import { Environment } from "@plugins/baseExperience";
import { Floor } from "@plugins/baseExperience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { Actor } from "@plugins/baseExperience";
import { World } from "@plugins/baseExperience";
import * as THREE from "three";
import GameEnvironment from "./GameEnvironment";
import InteractionManager from "../interactions/InteractionManager";

export default class Playground extends World {
  declare experience: Experience;
  declare scene: Experience["scene"];
  declare environment: Environment;
  declare resources: Experience["resources"];
  declare floor: Floor;
  declare fox: Actor
  private declare interactionManager: InteractionManager

  init() {
    super.init();
    this.floor = new Floor();
    this.environment = new GameEnvironment(
      this.resources.items.environmentMapTexture1 as THREE.CubeTexture,
      true
    );

    this.fox = new Actor(
      "pineTree",
      this.resources.items.pineModel as GLTF,
      true,
      false,
      true,
      this.resources.items.pineModel as GLTF
    );
    this.fox.setScale(1, 1, 1);

    this.interactionManager = new InteractionManager();

    // Add colisions
    const collisionManager = Experience.instance?.collisionManager;
    if (!collisionManager)
      throw new Error(
        "Playground initialization failed: CollisionManager is not available."
      );
    collisionManager?.addCollisionObjects([this.floor]);
    // collisionManager?.addCollisionObjects([this.fox]);
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }
    if (this.interactionManager) {
      this.interactionManager.update();
    }
    if (this.environment) {
      this.environment.update();
    }
  }
}
