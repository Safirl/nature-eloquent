import { Actor } from "base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { findPlayerCamera } from "../utils/WorldUtils";
import type { Camera } from "three";

export default class InteractableObject extends Actor {
    declare playerCamera: Camera
    declare threshold: number

    constructor(name: string, resource: GLTF) {
        super(name, resource)
        const player = findPlayerCamera();
        if (!player) return;
        this.playerCamera = player
        this.threshold = 5.
    }

    init() {
    }

    pickObject() {

    }

    getName(): string {
        return this.name;
    }

    destroy() {

    }

    update(): void {
        if (!this.playerCamera) {
            return;
        }
        const distance = this.playerCamera.position.distanceTo(this.model.position)
        if (distance < this.threshold)
            console.log("triggered !")
    }
}