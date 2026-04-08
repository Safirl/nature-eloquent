import { Actor, Environment, Experience, Floor, World } from "base-experience";
import type { FirstPersonCameraOctree } from "first-person-plugin";
import type { GLTF } from "three/examples/jsm/Addons.js";
import InteractableObject from "../interactable/InteractableObject";
import * as THREE from "three"

export default class BlockingWorld extends World {
    declare experience: Experience;
    declare scene: Experience["scene"];
    declare environment: Environment;
    declare resources: Experience["resources"];
    declare floor: Floor;
    declare levelDesign: Actor
    declare interactableObject: InteractableObject

    init() {
        super.init()
        this.floor = new Floor();
        this.levelDesign = new Actor("LD", this.resources.items.levelDesignModel as GLTF)
        this.environment = new Environment();
        this.interactableObject = new InteractableObject("interactableMushroom", this.resources.items.mushroomModel as GLTF)
        this.interactableObject.model.scale.set(2,2,2)

        const camera = Experience.instance?.camera as FirstPersonCameraOctree;
        if (camera.worldOctree) {
            // camera.worldOctree.fromGraphNode(this.floor.mesh);
            const group = new THREE.Group()
            group.add(this.interactableObject.model.clone())
            group.add(this.levelDesign.model.clone())
            camera.worldOctree.fromGraphNode(group);
        }
    }

    update() {
        if (this.levelDesign) {
            this.levelDesign.update()
            this.interactableObject.update()
        }
    }
}