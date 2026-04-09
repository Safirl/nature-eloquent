import { Experience } from "base-experience";
import * as THREE from "three"
import type { Resources } from "base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import type { Time } from "base-experience";
import type { Debug } from "base-experience";
import type GUI from "lil-gui";
import { Animation } from "base-experience";
import Leafs from "./Leafs";

export default class Tree {
    declare experience: Experience
    declare scene: THREE.Scene
    declare resources: Resources
    declare resource: GLTF
    declare model: THREE.Object3D
    declare animation: Animation
    declare time: Time
    declare debug: Debug
    declare debugFolder: GUI
    declare name: string
    declare leafs: Leafs;

    constructor(name: string, resource: GLTF) {
        if (!Experience.instance) {
            return;
        }

        this.resource = resource
        this.experience = Experience.instance

        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.setModel()
        this.setLeafs()
    }

    setModel() {
        this.model = this.resource.scene
        this.scene.add(this.model)
        this.model.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false
                child.position.x = 0
                child.position.z = 0
                child.position.y = 0
                child.material = new THREE.MeshBasicMaterial({ color: "#ffffff" })
            }
        })
    }

    setLeafs() {
        const texture = this.resources.items.leafs_texture as THREE.Texture

        this.leafs = new Leafs("tree-leafs", texture) // 🤡
    }

}