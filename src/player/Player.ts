import { Experience, type InputEventArgs } from "base-experience";
import { FirstPersonCameraOctree } from "first-person-plugin";
import type InteractableObject from "../interactable/InteractableObject";
import OutlinerManager from "./OutlinerManager";

export default class Player extends FirstPersonCameraOctree {
    declare closestObject: InteractableObject | null
    declare outlineManager: OutlinerManager
    bindInputs(): void {
        super.bindInputs();
        if (!Experience.instance) return;
        Experience.instance.inputSystem.on("interact", this.interactWithObject)
        this.outlineManager = new OutlinerManager();
    }

    interactWithObject = (args: InputEventArgs) => {
        if (args.type === "pressed") {
            console.log("pressed")
        }
    }

    setClosestObject = (object: InteractableObject) => {
        if (this.closestObject === object) return;
        if (this.closestObject) {
            const newDistance = this.instance.position.distanceTo(object.model.position)
            const oldDistance = this.instance.position.distanceTo(this.closestObject.model.position)
            if (newDistance > oldDistance) {
                return;
            }
            this.clearClosestObject(this.closestObject)
        }
        this.closestObject = object
        this.outlineManager.addObjectOutline(this.closestObject.model)
    }

    clearClosestObject = (object: InteractableObject) => {
        if (this.closestObject !== object) return;

        this.closestObject = null
        this.outlineManager.removeObjectOutline(object.model)
    }
} 