import "./assets/reset.css";
import "./assets/style.css";
import { Camera, OrbitCamera, type InputProfile } from "@plugins/baseExperience";
import sources from "./resources/sources";
import Playground from "./world/PlaygroundWorld";
import { FirstPersonCameraOctree } from "@plugins/firstPersonCamera";
import GameExperience from "./GameExperience";
import { keyboardProfile, BitControllerProfile } from "./resources/inputProfiles";
import gsap from "gsap";
import { exp } from "three/src/nodes/TSL.js";

const transitionForeground = document.getElementById("transition-foreground") as HTMLDivElement;
const startBtn = document.querySelector(".start-btn") as HTMLDivElement;

const startLoading = () => {
	const canvas: HTMLCanvasElement = document.getElementById("three") as HTMLCanvasElement;
	if (!canvas) {
		console.error("no canvas found with three identifier");
		return;
	}
	canvas.style.width = "100%";
	canvas.style.height = "100%";

	const camera = new FirstPersonCameraOctree();
	const world = new Playground();
	const experience = new GameExperience(canvas, sources, camera, world);
	const profiles: InputProfile[] = [keyboardProfile, BitControllerProfile];
	experience.inputSystem.addInputProfiles(profiles);

	experience.resources.on("ready", () => {
		gsap.to(transitionForeground.style, {
			opacity: 0,
			duration: 2,
			ease: "power1.inOut",
			onComplete: () => {
				transitionForeground.style.display = "none";
			},
		});
	});
	//new SubtitleManager();
};

const init = () => {
	document.removeEventListener("click", init);
	// canvas.requestPointerLock();
	transitionForeground.style.display = "inherit";
	gsap.to(transitionForeground.style, {
		opacity: 1,
		duration: 2,
		onComplete: () => {
			startBtn.style.display = "none";
			startLoading();
		},
	});
};

document.addEventListener("click", init);
