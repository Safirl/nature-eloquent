import { Experience, type InputEventArgs } from "base-experience";
import { FirstPersonCameraOctree } from "first-person-plugin";
import type InteractableObject from "../interactable/InteractableObject";
import type BlockingWorld from "../world/Blocking";

export default class Player extends FirstPersonCameraOctree {
    declare closestObject: InteractableObject | null

    bindInputs(): void {
        super.bindInputs();
        if (!Experience.instance) return;
        Experience.instance.inputSystem.on("interact", this.interactWithObject)
    }

    interactWithObject = (args: InputEventArgs) => {
        if (args.type === "pressed") {
            console.log("pressed")
        }
    }

    setClosestObject = (object: InteractableObject) => {
        if (!Experience.instance) throw new Error("Can't set closest object: Experience is not valid");

        if (this.closestObject === object) return;
        if (this.closestObject) {
            const newDistance = this.instance.position.distanceTo(object.model.position)
            const oldDistance = this.instance.position.distanceTo(this.closestObject.model.position)
            if (newDistance > oldDistance) {
                return;
            }
            this.clearClosestObject(this.closestObject)
        }
        const world = Experience.instance.world as BlockingWorld
        if (!world) throw new Error("Can't set closest object: Blocking world is not valid");
        this.closestObject = object
        world.outlineManager.addObjectOutline(this.closestObject.model)
        this.trigger("onSelectedObjectChanged", [this.closestObject])
    }

    clearClosestObject = (object: InteractableObject) => {
        if (!Experience.instance) throw new Error("Can't set closest object: Experience is not valid");

        if (this.closestObject !== object) return;

        const world = Experience.instance.world as BlockingWorld
        if (!world) throw new Error("Can't set closest object: Blocking world is not valid");

        this.closestObject = null
        world.outlineManager.removeObjectOutline(object.model)
        this.trigger("onSelectedObjectChanged", [null])
    }
} 