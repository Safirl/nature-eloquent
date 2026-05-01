import "./assets/reset.css";
import "./assets/style.css";
import { Experience, type InputProfile } from "@plugins/baseExperience";
import sources from "./resources/sources";
import Playground from "./world/PlaygroundWorld";
import SubtitleManager from "./subtitle/SubtitleManager";
import { FirstPersonCameraOctree, keyboardProfile } from "@plugins/firstPersonCamera";
import OrbitPlayer from "./camera/OrbitPlayer";

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
	const experience = new Experience(canvas, sources, camera, world);
	new SubtitleManager();
	const profiles: InputProfile[] = [keyboardProfile];

	experience.inputSystem.addInputProfiles(profiles);
};

init();
