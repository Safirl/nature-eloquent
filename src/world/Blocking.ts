import { Actor, Environment, Experience, Floor, World } from "base-experience";
import type { FirstPersonCameraOctree } from "first-person-plugin";
import type { GLTF } from "three/examples/jsm/Addons.js";
import InteractableObject from "../interactable/InteractableObject";
import * as THREE from "three"
import OutlinerManager from "./OutlinerManager";
import Tree from "../assets/components/Tree";
import Leafs from "../assets/components/Leafs";
export default class BlockingWorld extends World {
    declare experience: Experience;
    declare scene: Experience["scene"];
    declare environment: Environment;
    declare resources: Experience["resources"];
    declare floor: Floor;
    declare levelDesign: Actor
    declare interactableObjects: InteractableObject[]
    declare outlineManager: OutlinerManager
    declare tree: Tree
    declare bushes: Leafs

    init() {
        super.init()
        this.floor = new Floor();
        this.levelDesign = new Actor("LD", this.resources.items.levelDesignModel as GLTF, true, false, this.resources.items.levelDesignModel as GLTF)
        this.environment = new Environment();
        this.outlineManager = new OutlinerManager();

        this.bushes = new Leafs()
        this.interactableObjects = []
        const mushroom1 = new InteractableObject("interactableMushroom1", this.resources.items.mushroomModel as GLTF, true, false, this.resources.items.mushroomCollider as GLTF)
        const mushroom2 = new InteractableObject("interactableMushroom1", this.resources.items.mushroomModel as GLTF, true, false, this.resources.items.mushroomCollider as GLTF)
        mushroom1.model.scale.addScalar(2.)
        mushroom1.model.position.set(5, 0, 5)
        mushroom2.model.scale.addScalar(2.)
        mushroom2.model.position.set(5, 0, 10)
        this.interactableObjects.push(mushroom1, mushroom2)

        const collisionManager = Experience.instance?.collisionManager
        if (!collisionManager) throw new Error("CollisionTemplateWorld initialization failed: CollisionManager is not available.");
        if (collisionManager) {
            collisionManager.addCollisionObject([this.levelDesign])
            // this.interactableObjects
            collisionManager.addCollisionObject(this.interactableObjects)
            // const model = this.resources.items.mushroom1 as GLTF
            // collisionManager.worldOctree.fromGraphNode(mushroom1.collisionResource.scene)
            // collisionManager.worldOctree.fromGraphNode(mushroom2.collisionResource.scene)
        }

        const surface = 200

        this.tree = new Tree("tree_1", {
            model: this.resources.items["tree_1"] as GLTF,
            count: 1000,
            surface: surface
        })

        /*
            * add bushes on the floor
        */
        const bushesOnTheFloor = 500;
        for (let i = 0; i < bushesOnTheFloor; i++) {
            this.bushes.addLeafPosition(new THREE.Vector3(
                (Math.random() * surface) - surface * 0.5,
                0.75,
                (Math.random() * surface) - surface * 0.5,
            ))

        }
        this.bushes.create()


        console.log(this.bushes)

    }

    update() {
        if (this.levelDesign) {
            this.levelDesign.update()
            this.interactableObjects.forEach((o) => {
                o.update()
            })
            this.bushes.update()
        }
    }
}