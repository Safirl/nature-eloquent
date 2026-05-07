import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type { FirstPersonCameraOctree } from "@plugins/firstPersonCamera";
import type Playground from "../world/PlaygroundWorld";
import * as THREE from "three";
import type GameEnvironment from "../world/GameEnvironment";
import Grass from "../world/Grass";
import gsap from "gsap";

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
		this.grass.mesh.position.set(0, 49.8, -0.3);
		//wind scale 2
		// wind strength .039
		// wind frequency .0006
		this.grass.uniforms.uWindScale = { value: 2 };
		this.grass.uniforms.uWindStrength = { value: 0.039 };
		this.grass.uniforms.uWindFrequency = { value: 0.0006 };

		camera.instance.position.set(0, 50, 0);
		camera.instance.rotation.set(0.4, 0, 0);

		const container = document.createElement("div");
		container.style.opacity = "0";
		container.style.position = "absolute";
		container.style.top = "15%";
		container.style.left = "50%";
		container.style.transform = "translate(-50%)";
		container.style.zIndex = "1000";
		container.style.width = "800px";
		container.style.boxSizing = "fit-content";
		// container.style.backgroundColor = "red";
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.style.alignItems = "center";
		container.style.color = "#fffefb";
		container.style.gap = "16px";

		const cta = document.createElement("p");
		cta.innerHTML = "Cliquer pour commencer";
		cta.style.fontSize = "larger";

		const img = document.createElement("img");
		img.src = "textures/title.png";
		container.appendChild(img);
		container.appendChild(cta);
		document.body.appendChild(container);

		gsap.to(container.style, {
			delay: 3,
			opacity: 1,
			duration: 5,
			ease: "power1.inOut",
		});
	}
	init = () => {};
	update = () => {
		if (this.grass) this.grass.update();
	};
	destroy = () => {};
}
