import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import LavaLamp from "./LavaLamp";

export default class Room {
    declare lavalamp: LavaLamp
    declare private experience: Experience;
    declare private debugFolder: GUI;
    private declare scene: THREE.Scene;
    private position = new THREE.Vector3(0, 0.3, 0)


    constructor() {
        if (!Experience.instance) return;

        this.experience = Experience.instance;
        this.scene = this.experience.scene;
        this.lavalamp = new LavaLamp()



        const gltf = this.experience.resources.items.room as GLTF;
        const walls = gltf.scene.children.find((o: any) => o.name === "walls")
        if (walls) {

            walls.material.side = THREE.DoubleSide
        }
        gltf.scene.position.copy(this.position);
        this.scene.add(gltf.scene);
    }

    init() {
        this.lavalamp.init()
    }


    update() {
        this.lavalamp.update()
    }

}