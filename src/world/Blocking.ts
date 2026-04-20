import { Actor, Environment, Experience, Floor, World } from "@plugins/baseExperience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import InteractableObject from "../interactable/InteractableObject";
import OutlinerManager from "./OutlinerManager";
import * as THREE from "three"
import Cloud from "./Cloud";
import GameEnvironment from "./GameEnvironment";

export default class BlockingWorld extends World {
    declare experience: Experience;
    declare scene: Experience["scene"];
    declare environment: GameEnvironment;
    declare resources: Experience["resources"];
    declare floor: Floor;
    declare levelDesign: Actor
    declare interactableObjects: InteractableObject[]
    declare outlineManager: OutlinerManager
    declare fox: Actor
    declare cloud: Cloud

    init() {
        super.init()
        this.floor = new Floor();
        this.environment = new GameEnvironment(this.resources.items.environmentMapTexture1 as THREE.CubeTexture, true);
        this.outlineManager = new OutlinerManager();
        
        this.levelDesign = new Actor("LD", this.resources.items.levelDesignModel as GLTF, true, false, this.resources.items.levelDesignModel as GLTF)
        this.interactableObjects = []
        this.fox = new Actor("fox", this.resources.items.foxModel as GLTF, true)
        this.fox.setScale(0.02, 0.02, 0.02)
        const mushroom1 = new InteractableObject("champignon", this.resources.items.mushroomPaintedModel as GLTF, true)
        const mushroom2= new InteractableObject("champignon", this.resources.items.mushroomModel as GLTF, true, false, this.resources.items.mushroomCollider as GLTF)

        mushroom1.setScale(2., 2., 2.)
        // mushroom1.setPosition(5,.9,5)
        mushroom2.setScale(2., 2., 2.)
        mushroom2.setPosition(5,0,10)
        this.interactableObjects.push(mushroom2)

        const collisionManager = Experience.instance?.collisionManager
        if (!collisionManager) throw new Error("CollisionTemplateWorld initialization failed: CollisionManager is not available.");
        if (collisionManager) {
            collisionManager.addCollisionObjects([this.levelDesign])
            collisionManager.addCollisionObjects(this.interactableObjects)
        }
    }

    update() {
        if (this.levelDesign) {
            this.levelDesign.update()
            this.interactableObjects.forEach((o) => {
                o.update()
            })
        }
        if (this.fox) {
            this.fox.update()
        }
        if (this.cloud)
            this.cloud.update()
        if (this.environment)
            this.environment.update()
    }
}