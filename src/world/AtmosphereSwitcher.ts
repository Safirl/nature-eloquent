import { Debug, Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type Sky from "./Sky";
import * as THREE from "three";
import type GameEnvironment from "./GameEnvironment";
import gsap from "gsap";
import type GUI from "lil-gui";
import FogVariables from "../common/Fog";

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

	private debugAtmosphereIndex: number = 0;

	public atmospheres: {
		sunIntensity: number;
		sunPosition: THREE.Vector3;
		fogColor: string;
		sunColor: string;
		skyIndex: number;
		envMapIntensity: number;
	}[] = [
		//daylight
		{
			sunIntensity: 3,
			sunPosition: new THREE.Vector3(-17 * 0.75, 50 * 0.75, 24 * 0.75),
			fogColor: FogVariables.color,
			sunColor: "#fff",
			skyIndex: 0,
			envMapIntensity: 0.8,
		},
		//afternoon
		{
			sunIntensity: 2.5,
			sunPosition: new THREE.Vector3(-46 * 2, 20 * 2, 15 * 2),
			fogColor: "#010506",
			sunColor: "#f19e00",
			skyIndex: 1,
			envMapIntensity: 0.3,
		},
		//storm
		{
			sunIntensity: 0.225,
			sunPosition: new THREE.Vector3(10, 15, -24),
			fogColor: "#0F313B",
			sunColor: "#94BFC4",
			skyIndex: 7,
			envMapIntensity: 0.04,
		},
	];
	constructor(environment: GameEnvironment) {
		if (!Experience.instance)
			throw new Error("Experience is not valid : can't construct atmosphere switcher");
		this.experience = Experience.instance;
		this.environment = environment;
		this.fog = this.environment.fog;
		this.sun = this.environment.sunLight;
		this.sky = this.environment.sky;
		this.debug = this.experience.debug;
		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder("☁️ Atmosphere switcher");
		}
		this.setDebugObject();
	}
	init = () => {};
	destroy = () => {};
	update = () => {};
	setAtmosphere(index: number) {
		const atmosphere = this.atmospheres[index];
		if (!atmosphere) throw new Error(`No atmosphere found with index: ${index}`);

		//sun
		const newFOgColor = new THREE.Color(atmosphere.sunColor);
		gsap.to(this.fog.color, {
			r: newFOgColor.r,
			g: newFOgColor.g,
			b: newFOgColor.b,
			duration: this.duration,
			ease: "power2.inOut",
		});
		gsap.to(this.sun, {
			intensity: atmosphere.sunIntensity,
			duration: this.duration,
			ease: "power2.inOut",
		});
		const newSunColor = new THREE.Color(atmosphere.sunColor);
		gsap.to(this.sun.color, {
			r: newSunColor.r,
			g: newSunColor.g,
			b: newSunColor.b,
			duration: this.duration,
			ease: "power2.inOut",
			onUpdate: () => {
				this.environment.sunMesh.material.emissive = this.sun.color;
			},
		});
		gsap.to(this.environment.sunlightOffset, {
			x: atmosphere.sunPosition.x,
			y: atmosphere.sunPosition.y,
			z: atmosphere.sunPosition.z,
			duration: this.duration,
		});
		gsap.to(this.environment.environmentMap, {
			intensity: atmosphere.envMapIntensity,
			onUpdate: () => {
				this.environment.environmentMap.updateMaterials();
			},
			duration: this.duration,
		});
		this.sky.switchToNewSky(atmosphere.skyIndex, this.duration);
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
