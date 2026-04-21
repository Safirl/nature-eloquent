import {Experience} from "@plugins/baseExperience";
import {Environment} from "@plugins/baseExperience";
import {Floor} from "@plugins/baseExperience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import {Actor} from "@plugins/baseExperience";
import {World} from "@plugins/baseExperience";
import * as THREE from "three"
import GameEnvironment from "./GameEnvironment";

export default class Playground extends World{
  declare experience: Experience;
  declare scene: Experience["scene"];
  declare environment: Environment;
  declare resources: Experience["resources"];
  declare floor: Floor;
  declare fox: Actor
  declare fox1: Actor

  init() {
    super.init()
    this.floor = new Floor();
    this.environment = new GameEnvironment(this.resources.items.environmentMapTexture1 as THREE.CubeTexture, true);
    
    //Fox is just an actor because it doesn't have any logic in it.
    this.fox = new Actor("fox", this.resources.items.foxModel as GLTF, true, false, this.resources.items.foxModel as GLTF)
    this.fox.setScale(.02,.02,.02)
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}
