import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type { FirstPersonCameraOctree } from "@plugins/firstPersonCamera";
import type Playground from "../world/PlaygroundWorld";
import * as THREE from "three";
import type GameEnvironment from "../world/GameEnvironment";
import Grass from "../world/Grass";
import gsap from "gsap";
import type GameExperience from "../GameExperience";
import type { DialogStep } from "../scene/sceneDescriptions";

const GAME_STEP_ID = 1;

export default class Introduction implements LifeTimeObject {
	declare grass: Grass;
	declare private exp: GameExperience;
	declare private transitionForeground: HTMLDivElement;
	declare private introductionContainer: HTMLDivElement;
	constructor() {
		const exp = Experience.instance;
		if (!exp) return;
		this.exp = exp as GameExperience;
		/**
		 * SKIP INTRO DEBUG
		 */
		if (exp.debug.active) {
			this.initPlayerPosition();
			exp.init();
			return;
		}
		/**
		 * SKIP INTRO DEBUG
		 */
		this.transitionForeground = document.getElementById(
			"transition-foreground"
		) as HTMLDivElement;
		document.addEventListener("click", this.launchExperience);
		this.exp.audioListenerManager.playAmbiantSound(
			"/audio/ambiantSounds/EV_Impro_modal_PP_intro.mp3"
		);
		const camera = exp.camera as FirstPersonCameraOctree;
		if (!camera) return;
		camera.enable = false;

		const world = exp.world as Playground;
		// world.menu.view.hide(true);
		const env = world.environment as GameEnvironment;
		env.fog.far = 300;

		// const position = new THREE.Vector3()

		this.grass = new Grass(4000, 3, 3);
		this.grass.mesh.position.set(0, 49.8, -0.3);
		this.grass.uniforms.uWindScale = { value: 2 };
		this.grass.uniforms.uWindStrength = { value: 0.039 };
		this.grass.uniforms.uWindFrequency = { value: 0.0006 };

		camera.instance.position.set(0, 50, 0);
		camera.instance.rotation.set(0.4, 0, 0);

		this.introductionContainer = document.createElement("div");
		this.introductionContainer.style.opacity = "0";
		this.introductionContainer.style.position = "absolute";
		this.introductionContainer.style.top = "15%";
		this.introductionContainer.style.left = "50%";
		this.introductionContainer.style.transform = "translate(-50%)";
		this.introductionContainer.style.zIndex = "1000";
		this.introductionContainer.style.width = "800px";
		this.introductionContainer.style.boxSizing = "fit-content";
		this.introductionContainer.style.display = "flex";
		this.introductionContainer.style.flexDirection = "column";
		this.introductionContainer.style.alignItems = "center";
		this.introductionContainer.style.color = "#fffefb";
		this.introductionContainer.style.gap = "16px";

		const cta = document.createElement("p");
		cta.innerHTML = "Cliquer pour commencer";
		cta.style.fontSize = "larger";

		const img = document.createElement("img");
		img.src = "textures/title.png";
		this.introductionContainer.appendChild(img);
		this.introductionContainer.appendChild(cta);
		document.body.appendChild(this.introductionContainer);

		gsap.to(this.introductionContainer.style, {
			delay: 3,
			opacity: 1,
			duration: 5,
			ease: "power1.inOut",
		});
	}

	launchExperience = () => {
		document.removeEventListener("click", this.launchExperience);
		this.transitionForeground.style.display = "inherit";
		this.transitionForeground.innerHTML = "";
		this.exp.audioListenerManager.stopSfxLoop(
			"/audio/ambiantSounds/EV_Impro_modal_PP_intro.mp3"
		);
		gsap.to(this.transitionForeground.style, {
			opacity: 1,
			duration: 2,
			ease: "power1.inOut",
			onComplete: this.onIntroductionCompleted,
		});
	};

	onIntroductionCompleted = () => {
		this.exp.init();
		this.grass.destroy();
		this.initPlayerPosition();
		const dot = document.getElementById("camera-cursor");
		dot.style.opacity = "1";

		const camera = this.exp.camera as FirstPersonCameraOctree;
		if (!camera) return;
		camera.enable = true;

		document.body.removeChild(this.introductionContainer);
		this.exp.sceneManager.on("onActiveStepAdded", (activeStep: DialogStep) => {
			if (activeStep.id === GAME_STEP_ID) {
				gsap.to(this.transitionForeground.style, {
					opacity: 0,
					duration: 2,
					ease: "power1.inOut",
					onComplete: () => {
						this.transitionForeground.style.display = "none";
						this.destroy();
					},
				});
			}
		});
	};
	initPlayerPosition() {
		const camera = this.exp.camera as FirstPersonCameraOctree;
		if (!camera) return;
		camera.teleportPlayer(new THREE.Vector3(-0.26, 1.19, 0.45));
		camera.instance.position.set(-0.26, 1.19, 0.45);

		camera.instance.rotation.set(-0.576, 8.11, 0);
	}
	init = () => {};
	update = () => {
		if (this.grass) this.grass.update();
	};
	destroy = () => {};
}
