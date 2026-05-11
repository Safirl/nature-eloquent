import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type GameExperience from "../GameExperience";
import type { DialogStep } from "../scene/sceneDescriptions";

export default class EndSequence implements LifeTimeObject {
	declare private exp: GameExperience;
	declare private transitionForeground: HTMLDivElement;

	constructor() {
		const exp = Experience.instance;
		if (!exp) return;
		this.exp = exp as GameExperience;
		this.transitionForeground = document.getElementById(
			"transition-foreground"
		) as HTMLDivElement;
	}
	init = () => {
		const sceneManager = this.exp.sceneManager;
		if (!sceneManager) return;

		sceneManager.on("onActiveStepAdded", (dialogueStep: DialogStep) => {
			if (dialogueStep.id === 24) {
				this.transitionForeground.style.backgroundColor = "black";
				this.transitionForeground.style.opacity = "1";
				this.transitionForeground.style.display = "inherit";
				const dot = document.getElementById("camera-cursor");
				dot.style.opacity = "0";
			}
		});
	};
	update = () => {};
	destroy = () => {};
}
