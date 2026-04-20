import { Experience, OrbitCamera, type InputEventArgs } from "@plugins/baseExperience";
import { FirstPersonCameraOctree } from "@plugins/firstPersonCamera";
import type InteractableObject from "../interactable/InteractableObject";
import type BlockingWorld from "../world/Blocking";

export default class Player extends FirstPersonCameraOctree {
    declare closestObject: InteractableObject | null
    public enableDebugView: boolean = false;

    bindInputs(): void {
        super.bindInputs();
        if (!Experience.instance) return;
        Experience.instance.inputSystem.on("interact", this.interactWithObject)
    }

    interactWithObject = (args: InputEventArgs) => {
        if (args.type === "pressed") {
            this.trigger("onInteractionPressed", [this.closestObject])
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

    update(): void {
        if (!this.enableDebugView)
            super.update()
    }

    setDebugObject(): void {
        if (!this.debug.active) {
            return;
        }
        super.setDebugObject();

        this.debugFolder.add(this, "enableDebugView").onChange((b: boolean) => {
            b ? this.removePointerLock() : this.addPointerLock()
            if (b) {
                const camera = new OrbitCamera()
                camera.init()
                this.experience.camera = camera;
            }
            else {
                this.experience.camera = this;
            }
        })
    }

    removePointerLock = () => {
        console.log("coucou")
        Experience.instance?.canvas.removeEventListener("mousedown", this.lockPointer);
    }

    addPointerLock = () => {
        Experience.instance?.canvas.addEventListener("mousedown", this.lockPointer);
    }
} 