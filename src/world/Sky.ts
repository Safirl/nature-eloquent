import {
	Debug,
	Experience,
	type LifeTimeObject,
} from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three";
//@ts-ignore
import skyFragment from "@shaders/skybox/fragment.glsl";
//@ts-ignore
import skyVertex from "@shaders/skybox/vertex.glsl";
import gsap from "gsap";

interface Gradient {
	index: number;
	0: string;
	1: string;
	2: string;
}

export default class Sky implements LifeTimeObject {
	private skyMesh: THREE.Mesh;
	declare size: number;
	declare experience: Experience;
	declare scene: THREE.Scene;
	declare debug: Debug;
	declare debugFolder: GUI;
	private skyBoxMaterial: THREE.ShaderMaterial;
	declare currentGradientIndex: number;
	private gradients: Gradient[] = [
		{
			index: 0,
			0: "#4499B0",
			1: "#9CC0D0",
			2: "#ABC3B6",
		},
		{
			index: 1,
			0: "#689599",
			1: "#C8ECC8",
			2: "#EAFBEA",
		},
		{
			index: 2,
			0: "#AEB892",
			1: "#FAE989",
			2: "#E5B95A",
		},
		{
			index: 3,
			0: "#953C2E",
			1: "#F5A72E",
			2: "#FFD18B",
		},
		{
			index: 4,
			0: "#511F26",
			1: "#9A412E",
			2: "#FFD18B",
		},
		{
			index: 5,
			0: "#393842",
			1: "#593E42",
			2: "#D09068",
		},
		{
			index: 6,
			0: "#062023",
			1: "#21363F",
			2: "#A16D4D",
		},
		{
			index: 7,
			0: "#041C1F",
			1: "#0C2B38",
			2: "#0F313B",
		},
	];

	constructor(time: number, parentDebugFolder?: GUI) {
		if (!Experience.instance)
			throw new Error(
				"Environment initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating the Environment."
			);

		this.experience = Experience.instance;
		this.scene = this.experience.scene;

		this.debug = this.experience.debug;

		if (this.debug.active) {
			this.debugFolder = parentDebugFolder
				? parentDebugFolder.addFolder("🌤️ Sky box")
				: this.debug.ui.addFolder("🌤️ Sky box");
		}

		this.setDebugObject();
		const gradient = this.getGradient(time);

		this.currentGradientIndex = 0;
		this.skyBoxMaterial = new THREE.ShaderMaterial({
			vertexShader: skyVertex,
			fragmentShader: skyFragment,
			side: THREE.BackSide,
			uniforms: {
				color0: {
					value: new THREE.Color(
						this.gradients[this.currentGradientIndex][0]
					),
				},
				color1: {
					value: new THREE.Color(
						this.gradients[this.currentGradientIndex][1]
					),
				},
				color2: {
					value: new THREE.Color(
						this.gradients[this.currentGradientIndex][2]
					),
				},
			},
		});
		this.skyMesh = new THREE.Mesh(
			new THREE.IcosahedronGeometry(800, 3),
			this.skyBoxMaterial
		);
		this.scene.add(this.skyMesh);
	}

	init = () => {};
	destroy = () => {};
	update = () => {};

	switchToNewSky(index: number) {
		const newGradient = this.getGradient(index);
	}

	switchToNextSky() {
		this.currentGradientIndex =
			(this.currentGradientIndex + 1) % this.gradients.length;
		const newGradient = this.getGradient(this.currentGradientIndex);
		console.log("new gradient", newGradient);
		if (!newGradient) return;

		[0, 1, 2].forEach((i) => {
			//@ts-ignore
			const c = new THREE.Color(newGradient[i]);
			gsap.to(this.skyBoxMaterial.uniforms[`color${i}`].value, {
				r: c.r,
				g: c.g,
				b: c.b,
				duration: 2,
				ease: "sine.inOut",
			});
		});
	}

	getGradient(index: number): Gradient | undefined {
		return this.gradients.find((g) => g.index === index);
	}

	setDebugObject() {
		if (!this.debug.active) return;

		this.debugFolder
			.add(this, "switchToNextSky")
			.name("Switch to next sky");
	}
}
