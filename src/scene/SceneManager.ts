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
    // declare stepDescriptions: { count: number, relatedStep: DialogStep }[]
    private declare interactionManager: InteractionManager
    declare sceneConfig: SceneType

    private currentSceneId: number = 0;
    private currentStepIndex: number = 0;

    private objectCounts: { [key: string]: number } = {}

    // private waitingForInteraction: boolean = false;
    // declare nextDialogButton: HTMLElement

    init() {
        // Bouton pour passer à la scène suivante
        // this.nextDialogButton = document.getElementById("next-dialog") as HTMLElement;
        // this.nextDialogButton.addEventListener("click", () => {
        //     if (this.waitingForInteraction) {
        //         this.waitingForInteraction = false;
        //         this.nextStepOrSceneAfterStepDialogFinished("onIntroductionCompleted");
        //     }
        // })
        this.sceneConfig = sceneConfig
        const exp = Experience.instance as GameExperience
        if (!exp)
            throw new Error("Can't initialize SceneManager: Experience is not valid")

        this.subtitle = exp.subtitleManager
        this.dialogsAudio = dialogSubtitleAudio;
        const world = Experience.instance?.world as Playground
        if (!world)
            throw new Error("can't initialize world")
        this.interactionManager = world.interactionManager
        this.playScene(0)
        this.interactionManager.on('onObjectPlaced', this.onObjectPlaced)

        this.subtitle.on("dialogFinished", (callbackName: string) => {
            // Si on souhaite que l'utilisateur interagisse pour passer à la step suivante.

            // if (callbackName === "onIntroductionCompleted") {
            //     this.waitingForInteraction = true;
            //     return;
            // }

            // if (callbackName === "onDinosaure02Completed") {
            //     this.waitingForInteraction = true;
            //     return;
            // }

            // if (callbackName === "onToybox01Completed") {
            //     this.waitingForInteraction = true;
            //     return;
            // }


            // Si on souhaite ajouter un delay avant de jouer la scène suivante
            if (callbackName === "onIntroductionCompleted") {
                this.delayAfterScene(5000).then(() => {
                    this.nextStepOrSceneAfterStepDialogFinished(callbackName);
                });
                return;
            }

            // Pour faire passer les scène automatiquement après dialogue
            this.nextStepOrSceneAfterStepDialogFinished(callbackName);
        });
    }

    // Durée après qu'une scène soit jouée
    delayAfterScene(duration: number) {
        return new Promise(resolve => setTimeout(resolve, duration));
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

        if (scene.name === "introduction") {
            this.triggerDialog(scene.steps[0].dialogId, scene.steps[0])
        }

        this.getInteractableObjects(sceneId);
        // this.playStep(this.currentStepIndex);
    }

    getInteractableObjects(sceneId: number) {
        const scene = this.sceneConfig[sceneId]
        if (!scene) {
            return
        }

        scene.steps.forEach(step => {
            step.objectsAdded?.forEach(obj => {
                if (this.interactionManager.interactableObjects.find((o: any) => o.name === obj.objectId || o.objectId === null)) return

                if (obj.objectId && obj.resourceName) {
                    this.interactionManager.addInteractableObject(obj.objectId, obj.resourceName)
                }
            })
            step.objectsRemoved?.forEach(obj => {
                if (this.interactionManager.interactableObjects.find((o: any) => o.name === obj.objectId)) {
                    this.interactionManager.deleteInteractableObject(obj.objectId)
                }
            })

        })
    }

    // playStep(stepId: number) {
    //     const scene = this.sceneConfig[this.currentSceneId]
    //     // console.log("playStep", stepId, scene)
    //     const step = scene.steps[stepId]
    //     if (!step) {
    //         throw new Error("step not found")
    //     }
    //     this.stepDescriptions.push({ count: 0, relatedStep: step })
    // }

    nextStepOrSceneAfterStepDialogFinished = (callbackName: string) => {
        this.currentStepIndex++;

        // Si il reste des étapes alors on joue l'étape suivante
        if (this.currentStepIndex < this.sceneConfig[this.currentSceneId].steps.length) {
            console.log("----------- step finished -----------")
            // this.playStep(this.currentStepIndex);
        }

        else {
            // S'il n'y a plus de scène on return
            if (this.currentSceneId >= this.sceneConfig.length) return

            console.log("----------- scene finished -----------")
            this.currentStepIndex = 0;
            this.currentSceneId++;
            this.playScene(this.currentSceneId);
        }
    }

    // // On vérifie si l'obj correspond à la sceneConfig
    // onObjectPlaced = (callbacks: string) => {
    //     // Le count est incrémenté en fonction du nombre de jouet
    //     console.log("description", this.stepDescriptions)

    //     this.stepDescriptions.forEach(stepDescription => {
    //         const object = stepDescription.relatedStep.objectsAdded.find(obj => obj.objectId === callbacks)
    //         console.log("object found", object)
    //         if (!object) return;
    //         stepDescription.count++
    //         console.log("stepDescription count", stepDescription.count)
    //         console.log("stepDescription relatedStep", stepDescription.relatedStep)
    //         if (stepDescription.count === object.triggerCount) {
    //             this.triggerDialog(stepDescription.relatedStep.dialogId, stepDescription.relatedStep)
    //         }

    //     })
    // }

    onObjectPlaced = (objectName: string) => {
        if (!this.objectCounts[objectName]) {
            this.objectCounts[objectName] = 0;
        }

        this.objectCounts[objectName]++;
        console.log("counts", this.objectCounts);

        const scene = this.sceneConfig[this.currentSceneId];
        scene.steps.forEach(step => {
            step.objectsAdded?.forEach(obj => {
                if (obj.objectId !== objectName) return;

                const count = this.objectCounts[objectName];
                if (count === obj.triggerCount) {
                    this.triggerDialog(step.dialogId, step);
                }
            });
        });
    }


    triggerDialog(dialogId: string, relatedStep: DialogStep) {
        if (!dialogId) return
        console.log("dialogID", dialogId)
        console.log("relatedStep", relatedStep)
        return this.subtitle.displayDialog(this.dialogsAudio[dialogId], relatedStep)
    }
}