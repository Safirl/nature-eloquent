import { EventEmitter, Experience } from "@plugins/baseExperience";
import InteractionManager, { type ObjectPlacedArgs } from "../interactions/InteractionManager";
import SubtitleManager from "../subtitle/SubtitleManager";
import dialogSubtitleAudio from "../subtitle/dialogSubtitleAudio.json"
import type Playground from "../world/PlaygroundWorld";
import type GameExperience from "../GameExperience";
import { sceneConfig, type DialogStep, type SceneType } from "../subtitle/sceneConfig";
import { call } from "three/tsl";

export default class SceneManager extends EventEmitter {
    declare subtitle: SubtitleManager;
    declare dialogsAudio: { [key: string]: { [value: string]: { audio: string, dialog: string, speaker: string } } }
    private declare interactionManager: InteractionManager
    declare sceneConfig: SceneType

    private currentSceneId: number = 0;
    private currentStepIndex: number = 0;

    private objectCounts: { [key: string]: number } = {}

    initDependencies() {
        const exp = Experience.instance as GameExperience
        if (!exp)
            throw new Error("Can't initialize SceneManager: Experience is not valid")

        const world = Experience.instance?.world as Playground
        if (!world)
            throw new Error("can't initialize world")
        this.interactionManager = world.interactionManager

        this.subtitle = exp.subtitleManager
        this.dialogsAudio = dialogSubtitleAudio;

    }

    initEventProgressGame() {
        this.interactionManager.on('onObjectPlaced', this.onObjectPlaced)

        // Passer à la step/scène suivante à la fin d'un dialogue
        this.subtitle.on("dialogFinished", (callbackName: string) => {

            // Condition spécifique pour chaque scène
            if (callbackName === "onIntroductionCompleted") {
                this.delayAfterScene(1000).then(() => {
                    this.nextStepOrSceneAfterStepDialogFinished();
                });
                return;
            }

            if (callbackName === "onGardenBedroom01Completed") {
                this.clearObjectCounts();
            }

            if (callbackName === "onForestFairy02Completed" || callbackName === "onForestExoticFlower01Completed") {
                this.delayAfterScene(1000).then(() => {
                    this.clearObjectCounts();
                    this.goToNextScene()
                })
                return;
            }

            if (callbackName === "onForestElf02Completed") {
                this.goToNextScene()
                // this.playScene(9) // On joue la scène de l'orage directement
            }

            this.nextStepOrSceneAfterStepDialogFinished();
        });
    }

    init() {
        this.initDependencies()
        this.initEventProgressGame()
        this.sceneConfig = sceneConfig
        this.playScene(0)
    }

    // Durée après qu'une scène soit jouée
    delayAfterScene(duration: number) {
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    // Forcer à passer à la scène suivante
    goToNextScene() {
        this.currentStepIndex = 0;
        this.currentSceneId++;
        this.playScene(this.currentSceneId);
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

        // Lancer automatiquement le dialogue (sans interaction de l'utilsiateur)
        const autoPlayDialogWithoutInteraction = ["introduction", "enterClairvoyantForest", "storm"]

        if (autoPlayDialogWithoutInteraction.includes(scene.name)) {
            this.triggerDialog(scene.steps[0].dialogId, scene.steps[0]);
        }

        this.getInteractableObjects(sceneId);
    }

    // Récupérer la barre d'outils
    getInteractableObjects(sceneId: number) {
        const scene = this.sceneConfig[sceneId]
        if (!scene) {
            return
        }

        scene.steps.forEach(step => {

            step.objectsAdded?.forEach(obj => {
                if (obj.objectId && obj.resourceName) {
                    if (obj.isActive === false) return;

                    // Évite le doublon d'objets
                    if (this.interactionManager.interactableObjects.find((o: any) => o.name === obj.objectId)) return

                    // Ajoute les objectsAdded de la scène
                    this.interactionManager.addInteractableObject(obj.objectId, obj.resourceName)

                }
            })

            step.objectsRemoved?.forEach(objectId => {
                this.interactionManager.deleteInteractableObject(objectId)
            })

        })
    }


    nextStepOrSceneAfterStepDialogFinished = () => {
        const scene = this.sceneConfig[this.currentSceneId];

        // Passe à la step suivante si existe
        if (this.currentStepIndex + 1 < scene.steps.length) {
            this.currentStepIndex++;
            console.log("----------- step finished -----------");
        }

        // sinon passe à la scène suivante
        else {
            console.log("----------- scene finished -----------");
            this.goToNextScene();
        }
    }

    onObjectPlaced = (objectName: string) => {
        if (!this.objectCounts[objectName]) {
            this.objectCounts[objectName] = 0;
        }

        // Incrémenter le count pour l'objet placé
        this.objectCounts[objectName]++;
        console.log("counts", this.objectCounts);

        const scene = this.sceneConfig[this.currentSceneId];
        if (!scene) {
            console.warn("Scene is undefined", this.currentSceneId);
            return;
        }

        // Pour chaque step on vérifie les conditions & l'incrémentation de l'objet placé
        scene.steps.forEach(step => {

            // Gameplay 2 : Si la condition est la somme de tous les élément placé >= count -> trigger dialog
            if (step.completionCondition) {
                let total = 0;
                for (const id of step.completionCondition.objectId) {
                    total += this.objectCounts[id] || 0;
                }
                if (total >= step.completionCondition.count) {
                    this.triggerDialog(step.dialogId, step);
                }
                return;
            }

            // Gameplay 1 : Si le triggerCount === count d'obj placé -> trigger dialog
            step.objectsAdded?.forEach(obj => {
                if (obj.objectId !== objectName) return;

                const count = this.objectCounts[objectName];
                if (count === obj.triggerCount) {

                    if (step.replaceObjects) {
                        this.replaceObject(obj.objectId, step.replaceObjects[0]);
                        this.setObjectActive(step.replaceObjects[0].objectId, true);
                        if (step.replaceObjects.length > 1) {
                            for (let i = 1; i < step.replaceObjects.length; i++) {
                                const newObj = step.replaceObjects[i];
                                this.setObjectActive(newObj.objectId, true);
                                this.interactionManager.addInteractableObject(newObj.objectId, newObj.resourceName);
                            }
                        }
                    }

                    this.triggerDialog(step.dialogId, step);
                }



            });
        });
    }

    replaceObject(
        oldObjectId: string,
        newObject: { objectId: string; resourceName: string }
    ) {
        this.setObjectActive(oldObjectId, false);
        this.interactionManager.deleteInteractableObject(oldObjectId);

        this.setObjectActive(newObject.objectId, true);
        this.interactionManager.addInteractableObject(
            newObject.objectId,
            newObject.resourceName
        );
    }

    setObjectActive(objectId: string, value: boolean) {
        const scene = this.sceneConfig[this.currentSceneId];
        if (!scene) return;

        scene.steps.forEach(step => {
            step.objectsAdded?.forEach(obj => {
                if (obj.objectId === objectId) {
                    obj.isActive = value;
                }
            });
        });
    }

    clearObjectCounts() {
        this.objectCounts = {}
    }


    triggerDialog(dialogId: string, relatedStep: DialogStep) {
        if (!dialogId) return
        console.log("dialogID", dialogId)
        console.log("relatedStep", relatedStep)
        return this.subtitle.displayDialog(this.dialogsAudio[dialogId], relatedStep)
    }
}