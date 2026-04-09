import { Actor, Environment, Experience, Floor, World } from "base-experience";
import type { FirstPersonCameraOctree } from "first-person-plugin";
import type { GLTF } from "three/examples/jsm/Addons.js";
import InteractableObject from "../interactable/InteractableObject";
import * as THREE from "three"
import OutlinerManager from "./OutlinerManager";

export default class BlockingWorld extends World {
    declare experience: Experience;
    declare scene: Experience["scene"];
    declare environment: Environment;
    declare resources: Experience["resources"];
    declare floor: Floor;
    declare levelDesign: Actor
    declare interactableObjects: InteractableObject[]
    declare outlineManager: OutlinerManager

    init() {
        super.init()
        this.floor = new Floor();
        this.levelDesign = new Actor("LD", this.resources.items.levelDesignModel as GLTF)
        this.environment = new Environment();
        this.outlineManager = new OutlinerManager();

        this.interactableObjects = []
        const mushroom1 = new InteractableObject("interactableMushroom1", this.resources.items.mushroomModel as GLTF, true)
        const mushroom2 = new InteractableObject("interactableMushroom2", this.resources.items.mushroomModel as GLTF, true)
        mushroom1.model.scale.set(2,2,2)
        mushroom2.model.scale.set(2,2,2)
        mushroom1.model.position.set(5,0,5)
        mushroom2.model.position.set(5,0,10)
        this.interactableObjects.push(mushroom1, mushroom2)

        const camera = Experience.instance?.camera as FirstPersonCameraOctree;
        if (camera.worldOctree) {
            const group = new THREE.Group()
            this.interactableObjects.forEach((o) => {
                group.add(o.model.clone())
            })
            group.add(this.levelDesign.model.clone())
            camera.worldOctree.fromGraphNode(group);
        }
    }

    update() {
        if (this.levelDesign) {
            this.levelDesign.update()
            this.interactableObjects.forEach((o) => {
                o.update()
            })
        }
    }
}