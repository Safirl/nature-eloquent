import { Camera, Experience, World, type Source } from "@plugins/baseExperience";
import SceneManager from "./scene/SceneManager";
import SubtitleManager from "./resources/subtitle/SubtitleManager";
import TriggerManager from "./trigger/TriggerManager";
import AudioListenerManager from "./audio/AudioListenerManager";
import Introduction from "./introduction/Introduction";
import Menu from "./menu";

export default class GameExperience extends Experience {
	declare public sceneManager: SceneManager;
	declare public audioListenerManager: AudioListenerManager;
	// declare public subtitleManager: SubtitleManager;
	declare replaceAmbiantSoundBtn: HTMLDivElement;
	declare audioManager: AudioListenerManager;
	declare private introductionSequence: Introduction;
	declare public menu: Menu;
	declare triggerManager: TriggerManager;

	constructor(canvas: HTMLCanvasElement, sources: Source[], camera: Camera, world: World) {
		super(canvas, sources, camera, world);
		this.replaceAmbiantSoundBtn = document.getElementById(
			"replace-ambient-sound"
		) as HTMLDivElement;

		//this.subtitleManager = new SubtitleManager();
		//this.sceneManager = new SceneManager();

		// this.replaceAmbiantSoundBtn.addEventListener("click", () => {
		// 	this.audioListenerManager.replaceAmbiantSound(this.audioListenerManager.allAudio[0].audioSrc, "/audio/ambiantSounds/Impro_modal_PP_non_functionnal_and_colors.mp3");
		// })
	}

	onResourcesLoaded(): void {
		super.onResourcesLoaded();
		this.audioListenerManager = new AudioListenerManager();
		this.introductionSequence = new Introduction();

		// this.subtitleManager.init();
		// this.sceneManager.init();
	}

	init = () => {
		this.menu = new Menu();
		this.sceneManager = new SceneManager(this.menu);
		this.triggerManager = new TriggerManager(this.menu);

		this.menu.init();
		this.sceneManager.init();
	};

	update(): void {
		super.update();
		// if (this.menu) {
		// 	this.menu.update();
		// }
		this.introductionSequence.update();
		if (this.triggerManager) {
			this.triggerManager.update();
		}
	}
}
