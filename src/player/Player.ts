import { Experience, type InputEventArgs } from "base-experience";
import { FirstPersonCameraOctree } from "first-person-plugin";
import type InteractableObject from "../interactable/InteractableObject";

export default class Player extends FirstPersonCameraOctree {
    declare closestObject: InteractableObject | null
    bindInputs(): void {
        super.bindInputs();
        if (!Experience.instance) return;
        console.log("coucou")
        Experience.instance.inputSystem.on("interact", this.interactWithObject)
    }

    interactWithObject = (args: InputEventArgs) => {
        if (args.type === "pressed") {
            console.log("pressed")
        }
    }

    setClosestObject = (object: InteractableObject) => {
        if (this.closestObject === object) return;

        this.closestObject = object
        console.log("adding", object)
    }

    clearClosestObject = (object: InteractableObject) => {
        if (this.closestObject !== object) return;
        
        this.closestObject = null
        console.log("removing", object)
    }
} 