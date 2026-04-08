import { Actor, Experience } from "base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import type Player from "../player/Player";

export default class InteractableObject extends Actor {
    declare player: Player
    declare threshold: number
    private isClose = false;

    constructor(name: string, resource: GLTF) {
        super(name, resource)
        const player = Experience.instance?.camera as Player;
        if (!player) return;
        this.player = player
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
        if (!this.player) {
            return;
        }
        const distance = this.player.instance.position.distanceTo(this.model.position)
        if (distance < this.threshold && !this.isClose) {
            this.player.setClosestObject(this)
            this.isClose = true;
        }
        else if (distance > this.threshold && this.isClose){
            this.player.clearClosestObject(this)
            this.isClose = false;
        }
    }
}