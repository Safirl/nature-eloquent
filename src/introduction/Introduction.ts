import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type { FirstPersonCameraOctree } from "@plugins/firstPersonCamera";
import type Playground from "../world/PlaygroundWorld";
import * as THREE from "three";
import type GameEnvironment from "../world/GameEnvironment";
import Grass from "../world/Grass";

export default class Introduction implements LifeTimeObject {
	declare grass: Grass;
	constructor() {
		const exp = Experience.instance;
		if (!exp) return;
		const camera = exp.camera as FirstPersonCameraOctree;
		if (!camera) return;
		camera.enable = false;

		const dot = document.getElementById("camera-cursor");
		dot.style.display = "none";

		const world = exp.world as Playground;
		world.menu.view.hide(true);
		const env = world.environment as GameEnvironment;
		env.fog.far = 300;

		// const position = new THREE.Vector3()

		this.grass = new Grass();
		this.grass.mesh.position.set(0, 49.8, 0);

		camera.instance.position.set(0, 50, 0);
		camera.instance.rotation.set(0.2, 0, 0);
	}
	init = () => {};
	update = () => {
		if (this.grass) this.grass.update();
	};
	destroy = () => {};
}
