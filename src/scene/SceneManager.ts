//    this.interactionManager.on("onObjectPlaced", (callbacks: ObjectPlacedArgs) => {
//             console.log(callbacks)
//         })

import { EventEmitter, Experience } from "@plugins/baseExperience";
import InteractionManager, { type ObjectPlacedArgs } from "../interactions/InteractionManager";
import SubtitleManager from "../subtitle/SubtitleManager";
import dialogSubtitleAudio from "../subtitle/dialogSubtitleAudio.json"
import type Playground from "../world/PlaygroundWorld";
import type GameExperience from "../GameExperience";
import { sceneConfig, type DialogStep, type SceneType } from "../subtitle/sceneConfig";

export default class SceneManager extends EventEmitter {
    declare subtitle: SubtitleManager;
    declare dialogsAudio: { [key: string]: { [value: string]: { audio: string, dialog: string, speaker: string } } }
    declare stepDescriptions: { count: number, relatedStep: DialogStep }[]
    private declare interactionManager: InteractionManager
    declare sceneConfig: SceneType

    private currentSceneId: number = 0;
    private currentStepIndex: number = 0;

    init() {
        this.sceneConfig = sceneConfig
        this.stepDescriptions = []
        const exp = Experience.instance as GameExperience
        if (!exp)
            throw new Error("Can't initialize SceneManager: Experience is not valid")

        this.subtitle = exp.subtitleManager
        this.dialogsAudio = dialogSubtitleAudio;
        const world = Experience.instance?.world as Playground
        if (!world)
            throw new Error("nullos")

        // console.log("world", world.interactionManager)

        this.interactionManager = world.interactionManager
        // console.log(this.interactionManager)
        //this.allInstancedMeshManagers = this.interactionManager.InstancedMeshManagers

        this.playScene(0)
        this.interactionManager.on('onObjectPlaced', this.onObjectPlaced)
        this.subtitle.on("dialogFinished", this.nextStepOrSceneAfterStepDialogFinished)
    }

    playScene(sceneId: number) {
        if (sceneId >= this.sceneConfig.length) {
            console.log("All scenes finished")
            return;
        }
        this.currentSceneId = sceneId
        const scene = this.sceneConfig[sceneId]
        if (!scene) {
            throw new Error("sceneConfig not found")
        }

        // Ajout de l'introduction
        if (scene.name === "introduction") {
            this.triggerDialog(scene.steps[0].dialogId, scene.steps[0])
        }

        // NOO
        // if (scene.name === "dinosaure") {
        //     this.interactionManager.addInteractableObject(scene.steps[0].objectsAdded[0].objectId, scene.steps[0].objectsAdded[0].resourceName)
        // }
        this.getInteractableObjects(sceneId);

        this.playStep(0)
    }

    getInteractableObjects(sceneId: number) {
        const scene = this.sceneConfig[sceneId]
        if (!scene) {
            return
        }

        // console.log("scene", scene)
        scene.steps.forEach(step => {
            // console.log("step", step)
            // console.log("step.objectAdded", step.objectsAdded.objectId)
            step.objectsAdded.forEach(obj => {
                // console.log("obj", obj)

                if (this.interactionManager.interactableObjects.find((o: any) => o.name === obj.objectId || o.objectId === null)) return

                if (obj.objectId && obj.resourceName) {
                    this.interactionManager.addInteractableObject(obj.objectId, obj.resourceName)
                }

                // console.log("all object displayed", this.interactionManager.interactableObjects)
            })
        })
    }

    playStep(stepId: number) {
        const scene = this.sceneConfig[this.currentSceneId]
        // console.log("playStep", stepId, scene)
        const step = scene.steps[stepId]
        if (!step) {
            throw new Error("step not found")
        }
        this.stepDescriptions.push({ count: 0, relatedStep: step })
    }

    nextStepOrSceneAfterStepDialogFinished = () => {
        console.log(this.stepDescriptions)
        this.currentStepIndex++;

        // Si il reste des étapes alors on joue l'étape suivante
        if (this.currentStepIndex < this.sceneConfig[this.currentSceneId].steps.length) {
            console.log("----------- step finished -----------")
            this.playStep(this.currentStepIndex);
        }

        // Sinon on passe à la scène suivante
        else {
            // S'il n'y a plus de scène on return
            if (this.currentSceneId >= this.sceneConfig.length) return

            console.log("----------- scene finished -----------")
            this.currentStepIndex = 0;
            this.currentSceneId++;
            this.playScene(this.currentSceneId);

        }
    }

    onObjectPlaced = (callbacks: string) => {
        this.stepDescriptions.forEach(stepDescription => {
            const object = stepDescription.relatedStep.objectsAdded.find(obj => obj.objectId === callbacks)
            if (!object) return;
            stepDescription.count++
            // console.log("stepDescription", stepDescription)
            if (stepDescription.count == object.triggerCount) {
                this.triggerDialog(stepDescription.relatedStep.dialogId, stepDescription.relatedStep)
            }
        })
    }

    triggerDialog(dialogId: string, relatedStep: DialogStep) {
        if (!dialogId) return
        // console.log("triggerDialog", dialogId, relatedStep)
        return this.subtitle.displayDialog(this.dialogsAudio[dialogId])
    }
}

