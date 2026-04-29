import { Camera, Experience, World, type Source } from "@plugins/baseExperience"
import SceneManager from "./scene/SceneManager";
import SubtitleManager from "./subtitle/SubtitleManager";

export default class GameExperience extends Experience {
    public declare sceneManager: SceneManager
    public declare subtitleManager: SubtitleManager
    constructor(canvas: HTMLCanvasElement, sources: Source[], camera: Camera, world: World) {
        super(canvas, sources, camera, world)

        this.subtitleManager = new SubtitleManager();
        this.sceneManager = new SceneManager()
    }

    onResourcesLoaded(): void {
        super.onResourcesLoaded()
        this.subtitleManager.init()
        this.sceneManager.init()
    }
}