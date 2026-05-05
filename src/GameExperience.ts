import { Camera, Experience, World, type Source } from "@plugins/baseExperience";
import SceneManager from "./scene/SceneManager";
import SubtitleManager from "./resources/subtitle/SubtitleManager";
import AudioListenerManager from "./audio/AudioListenerManager";

export default class GameExperience extends Experience {
	declare public sceneManager: SceneManager;
	declare public audioListenerManager: AudioListenerManager;
	// declare public subtitleManager: SubtitleManager;
	constructor(canvas: HTMLCanvasElement, sources: Source[], camera: Camera, world: World) {
		super(canvas, sources, camera, world);

		//this.subtitleManager = new SubtitleManager();
		//this.sceneManager = new SceneManager();
	}

	onResourcesLoaded(): void {
		super.onResourcesLoaded();
		this.audioListenerManager = new AudioListenerManager();
		this.audioListenerManager.playAmbiantSound("/audio/ambiantSounds/EV_Impro_modal_PP_intro.mp3");
		// this.subtitleManager.init();
		// this.sceneManager.init();
	}
}
