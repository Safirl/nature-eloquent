import "./assets/reset.css";
import "./assets/style.css";
import { OrbitCamera, type InputProfile } from "@plugins/baseExperience";
import sources from "./resources/sources";
import Playground from "./world/PlaygroundWorld";
import { FirstPersonCameraOctree } from "@plugins/firstPersonCamera";
import GameExperience from "./GameExperience";
import { keyboardProfile } from "./resources/inputProfiles";
import TriggerManager from "./trigger/TriggerManager";

const init = () => {
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
	//new SubtitleManager();
	const profiles: InputProfile[] = [keyboardProfile];

	experience.inputSystem.addInputProfiles(profiles);
	canvas.requestPointerLock();
};

const startBtn = document.querySelector(".start-btn") as HTMLDivElement;

startBtn.addEventListener("click", () => {
	startBtn.style.display = "none";
	init();
});
// init();
