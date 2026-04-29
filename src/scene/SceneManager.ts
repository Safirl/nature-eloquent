//    this.interactionManager.on("onObjectPlaced", (callbacks: ObjectPlacedArgs) => {
//             console.log(callbacks)
//         })

import { Experience } from "@plugins/baseExperience";
import InteractionManager, { type ObjectPlacedArgs } from "../interactions/InteractionManager";
import SubtitleManager from "../subtitle/SubtitleManager";
import dialogSubtitleAudio from "../subtitle/dialogSubtitleAudio.json"
import type Playground from "../world/PlaygroundWorld";
import type GameExperience from "../GameExperience";
import { sceneConfig, type SceneType } from "../subtitle/sceneConfig";

export default class SceneManager {
    declare subtitle: SubtitleManager;
    declare dialogsAudio: { [key: string]: { [value: string]: { audio: string, dialog: string, speaker: string } } }
    declare objectsCount: { objectName: string, count: number }[]
    private declare interactionManager: InteractionManager
    declare sceneConfig: SceneType

    init() {
        this.sceneConfig = sceneConfig as SceneType
        this.objectsCount = []
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
        this.interactionManager.on("onObjectPlaced", this.onObjectPlaced)
        //this.allInstancedMeshManagers = this.interactionManager.InstancedMeshManagers

        // this.onTriggerDialog(0, "introduction")
    }

    onObjectPlaced = (callbacks: string) => {
        console.log("callbacks", callbacks)

        if (this.objectsCount.find(obj => obj.objectName === callbacks)) {
            console.log("obj", this.objectsCount)
            const objIndex = this.objectsCount.findIndex(obj => obj.objectName === callbacks)
            this.objectsCount[objIndex].count++
        } else {
            this.objectsCount.push({ objectName: callbacks, count: 1 })
        }
        // Ajouter plusieurs conditions -> déclenche différents dialogues
        if (this.objectsCount.find(obj => obj.objectName === "mushroom" && obj.count === 2)) {
            this.onTriggerDialog(2, "dinosaure_01", "mushroom")
        }
        else return

    }


    onTriggerDialog(count: number, dialogId: string, objectName?: string) {
        if (!objectName)
            return this.subtitle.displayDialog(this.dialogsAudio[dialogId])

        const obj = this.objectsCount.find(obj => obj.objectName === objectName)
        if (obj && obj.count === count) {
            this.subtitle.displayDialog(this.dialogsAudio[dialogId])
            console.log("coucou")
        }
    }
}