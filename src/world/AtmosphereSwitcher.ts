import { Debug, Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type Sky from "./Sky";
import * as THREE from "three";
import type GameEnvironment from "./GameEnvironment";
import gsap from "gsap";
import type GUI from "lil-gui";
import FogVariables from "../common/Fog";
import { exp } from "three/src/nodes/TSL.js";
import GameExperience from "../GameExperience";
import type { DialogStep } from "../scene/sceneDescriptions";
import NewGrass from "./NewGrass"
export default class AtmosphereSwitcher implements LifeTimeObject {
	declare private experience: Experience;
	declare private sun: THREE.DirectionalLight;
	declare private environmentMap;
	declare private fog: THREE.Fog;
	declare private sky: Sky;
	declare private environment: GameEnvironment;
	private duration: number = 6;
	declare private debug: Debug;
	declare private debugFolder: GUI;
	declare grass: NewGrass;
	private debugAtmosphereIndex: number = 0;

	public atmospheres: {
		sunIntensity: number;
		sunPosition: THREE.Vector3;
		fogColor: string;
		sunColor: string;
		skyIndex: number;
		envMapIntensity: number;
		tipColor1: string
		tipColor2: string
		baseColor: string
	}[] = [
			//daylight
			{
				sunIntensity: 3,
				sunPosition: new THREE.Vector3(-17 * 0.75, 50 * 0.75, 24 * 0.75),
				fogColor: FogVariables.color,
				sunColor: "#fff",
				skyIndex: 0,
				envMapIntensity: 0.8,
				tipColor1: "#5d713e",
				tipColor2: "#5d713e",
				baseColor: "#313f1b",

			},
			//afternoon
			{
				sunIntensity: 2.5,
				sunPosition: new THREE.Vector3(-46 * 2, 20 * 2, 15 * 2),
				fogColor: "#010506",
				sunColor: "#f19e00",
				skyIndex: 1,
				envMapIntensity: 0.3,
				tipColor1: "#5d713e",
				tipColor2: "#5d713e",
				baseColor: "#313f1b",
			},
			//night
			{
				sunIntensity: 0,
				sunPosition: new THREE.Vector3(10, 15, -24),
				fogColor: "#030a0c",
				sunColor: "#94BFC4",
				skyIndex: 7,
				envMapIntensity: 0.1,
				tipColor1: "#0d1306", //"#010905",
				tipColor2: "#000000",//"#010204",
				baseColor: "#000000",//"#144c2d",
			},
		];
	constructor(environment: GameEnvironment) {
		if (!Experience.instance)
			throw new Error("Experience is not valid : can't construct atmosphere switcher");
		this.experience = Experience.instance;
		if (!(this.experience instanceof GameExperience)) return;
		this.environment = environment;
		this.fog = this.environment.fog;
		this.sun = this.environment.sunLight;
		this.sky = this.environment.sky;
		this.debug = this.experience.debug;
		this.grass = this.environment.grass

		this.experience.sceneManager.on("onActiveStepAdded", this.onActiveStepAdded);

		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder("☁️ Atmosphere switcher");
		}
		this.setDebugObject();
	}
	onActiveStepAdded = (step: DialogStep) => {
		if (step.id === 10) {
			this.setAtmosphere(1, 30);
		}
		if (step.id === 16) {
			this.setAtmosphere(2, 30);
		}
	};
	init = () => { };
	destroy = () => { };
	update = () => { };
	setAtmosphere(index: number, duration?: number) {
		if (duration === undefined) {
			duration = this.duration;
		}
		const atmosphere = this.atmospheres[index];
		if (!atmosphere) throw new Error(`No atmosphere found with index: ${index}`);

		//sun
		const newFOgColor = new THREE.Color(atmosphere.fogColor);
		gsap.to(this.fog.color, {
			r: newFOgColor.r,
			g: newFOgColor.g,
			b: newFOgColor.b,
			duration: duration,
			ease: "power2.inOut",
		});
		gsap.to(this.sun, {
			intensity: atmosphere.sunIntensity,
			duration: duration,
			ease: "power2.inOut",
		});
		const newSunColor = new THREE.Color(atmosphere.sunColor);
		gsap.to(this.sun.color, {
			r: newSunColor.r,
			g: newSunColor.g,
			b: newSunColor.b,
			duration: duration,
			ease: "power2.inOut",
			onUpdate: () => {
				this.environment.sunMesh.material.emissive = this.sun.color;
			},
		});
		gsap.to(this.environment.sunlightOffset, {
			x: atmosphere.sunPosition.x,
			y: atmosphere.sunPosition.y,
			z: atmosphere.sunPosition.z,
			duration: duration,
		});
		gsap.to(this.environment.environmentMap, {
			intensity: atmosphere.envMapIntensity,
			onUpdate: () => {
				this.environment.environmentMap.updateMaterials();
			},
			duration: duration,
		});




		const tipColor1 = new THREE.Color(atmosphere.tipColor1);

		gsap.to(this.grass.uniforms.uTipColor1.value, {
			r: tipColor1.r,
			g: tipColor1.g,
			b: tipColor1.b,
			duration: duration,
			ease: "power2.inOut",
			// onUpdate: () => {
			// 	this.environment.sunMesh.material.emissive = this.sun.color;
			// },
		});


		const tipColor2 = new THREE.Color(atmosphere.tipColor2);

		gsap.to(this.grass.uniforms.uTipColor2.value, {
			r: tipColor2.r,
			g: tipColor2.g,
			b: tipColor2.b,
			duration: duration,
			ease: "power2.inOut",
			// onUpdate: () => {
			// 	this.environment.sunMesh.material.emissive = this.sun.color;
			// },
		});

		const baseColor = new THREE.Color(atmosphere.baseColor);

		gsap.to(this.grass.uniforms.uBaseColor.value, {
			r: baseColor.r,
			g: baseColor.g,
			b: baseColor.b,
			duration: duration,
			ease: "power2.inOut",
			// onUpdate: () => {
			// 	this.environment.sunMesh.material.emissive = this.sun.color;
			// },
		});




		this.sky.switchToNewSky(atmosphere.skyIndex, duration);
	}

	switchToNextAtmosphere() {
		this.debugAtmosphereIndex++;
		this.setAtmosphere(this.debugAtmosphereIndex);
	}

	setDebugObject() {
		if (!this.debug.active) return;
		this.debugFolder.add(this, "switchToNextAtmosphere").name("Set next atmosphere");
	}
}
