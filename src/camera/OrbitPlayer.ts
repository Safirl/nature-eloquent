import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import {Camera} from "@plugins/baseExperience";

export default class OrbitPlayer extends Camera{
  declare controls: OrbitControls;

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      1000,
    );
    this.instance.position.set(6, 4, 8);
    super.setInstance()
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.maxDistance = 30;
    this.controls.minDistance = 5;
    this.controls.enableDamping = true;
  }

  update() {
    this.controls.update();
  }

  destroy(): void {
    this.controls.dispose();
  }

  setDebugObject() {
    super.setDebugObject();
    if(!this.debug.active) return;
    this.debugFolder
        .add(this.controls, 'maxDistance')
        .name('max distance')
        .min(5)
        .max(30)
        .step(.1)

    this.debugFolder
        .add(this.controls, 'minDistance')
        .name('min distance')
        .min(.1)
        .max(5)
        .step(.1)
  }
}
