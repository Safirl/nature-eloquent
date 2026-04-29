//    this.interactionManager.on("onObjectPlaced", (callbacks: ObjectPlacedArgs) => {
//             console.log(callbacks)
//         })

import { Experience } from "@plugins/baseExperience";
import InteractionManager, { type ObjectPlacedArgs } from "../interactions/InteractionManager";
import SubtitleManager from "../subtitle/SubtitleManager";
import dialogSubtitleAudio from "../subtitle/dialogSubtitleAudio.json"
import type Playground from "../world/PlaygroundWorld";
import type GameExperience from "../GameExperience";
import { sceneConfig, type DialogStep, type SceneType } from "../subtitle/sceneConfig";

export default class SceneManager {
    declare subtitle: SubtitleManager;
    declare dialogsAudio: { [key: string]: { [value: string]: { audio: string, dialog: string, speaker: string } } }
    declare stepDescriptions: { count: number, relatedStep: DialogStep }[]
    private declare interactionManager: InteractionManager
    declare sceneConfig: SceneType

    private currentSceneId: number = 0;

    init() {
        this.sceneConfig = sceneConfig as SceneType
        this.stepDescriptions = []
        const exp = Experience.instance as GameExperience
        if (!exp)
            throw new Error("Can't initialize SceneManager: Experience is not valid")

        this.subtitle = exp.subtitleManager
        this.dialogsAudio = dialogSubtitleAudio;
        const world = Experience.instance?.world as Playground
        if (!world)
            throw new Error("nullos")

        console.log("world", world.interactionManager)

        this.interactionManager = world.interactionManager
        console.log(this.interactionManager)
        // this.interactionManager.on("onObjectPlaced", this.onObjectPlaced)
        // this.introductionScene();
        //this.allInstancedMeshManagers = this.interactionManager.InstancedMeshManagers

        this.playScene(1)
        this.interactionManager.on('onObjectPlaced', this.onObjectPlaced)
    }

    // Jouer une scène en fonction de son identifiant
    playScene(sceneId: number) {
        this.currentSceneId = sceneId
        const scene = this.sceneConfig[sceneId]
        if (!scene) {
            throw new Error("sceneConfig not found")
        }

        this.playStep(0)
    }

    playStep(stepId: number) {
        const scene = this.sceneConfig[this.currentSceneId]
        const step = scene.steps[stepId]
        if (!step) {
            return;
        }
        this.stepDescriptions.push({ count: 0, relatedStep: step })
    }

    onObjectPlaced = (callbacks: string) => {
        this.stepDescriptions.forEach(stepDescription => {
            const object = stepDescription.relatedStep.objectsAdded.find(obj => obj.objectId === callbacks)
            if (!object) return;
            stepDescription.count++

            if (stepDescription.count == object.triggerCount) {
                this.triggerDialog(stepDescription.relatedStep.dialogId)
            }
        })
    }

    triggerDialog(dialogId: string) {
        if (!dialogId) return
        return this.subtitle.displayDialog(this.dialogsAudio[dialogId])

        // const obj = this.stepDescriptions.find(obj => obj.objectName === objectName)
        // if (obj) {
        //     this.subtitle.displayDialog(this.dialogsAudio[dialogId])
        //     console.log("coucou")
        // }
    }
}
