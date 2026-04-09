import { Actor, Experience } from "base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import type Player from "../player/Player";

export default class InteractableObject extends Actor {
    declare player: Player
    declare threshold: number

    constructor(name: string, resource: GLTF, makeUnique: boolean = false, makeMaterialsUnique: boolean = false) {
        super(name, resource, makeUnique, makeMaterialsUnique)
        const player = Experience.instance?.camera as Player;
        if (!player) return;
        this.player = player
        this.threshold = 5.
    }

    init = () => {};
    destroy= () => {};

    hideObject() {
        this.model.visible = false;
    }

    update(): void {
        if (!this.player) {
            return;
        }
        const distance = this.player.instance.position.distanceTo(this.model.position)
        if (distance < this.threshold) {
            this.player.setClosestObject(this)
        }
        else if (distance > this.threshold){
            this.player.clearClosestObject(this)
        }
    }
}