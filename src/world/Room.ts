import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type GameExperience from "../GameExperience";
import type GUI from "lil-gui";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { gsap } from "gsap";
import LavaLamp from "./LavaLamp";

export default class Room {
    declare lavalamp: LavaLamp
    declare private experience: Experience;
    declare private debugFolder: GUI;
    private declare scene: THREE.Scene;
    private position = new THREE.Vector3(0, 0.37, 0)
    private door: THREE.Object3D | undefined;
    private doorGrabber: THREE.Object3D | undefined;


    constructor() {
        if (!Experience.instance) return;

        this.experience = Experience.instance;
        this.scene = this.experience.scene;
        this.lavalamp = new LavaLamp()



        const gltf = this.experience.resources.items.room as GLTF;
        const walls = gltf.scene.children.find((o: any) => o.name === "walls")
        if (walls) {
            if (walls instanceof THREE.Mesh) {
                if (walls.material) {
                    walls.material.side = THREE.DoubleSide
                }
            }
        }

        this.door = gltf.scene.children.find((o: any) => o.name === "door");
        this.doorGrabber = gltf.scene.children.find((o: any) => o.name === "doorGrabber");

        gltf.scene.traverse(child => {
            if (child instanceof THREE.Mesh) {
                if (child.material) {
                    child.material.emissiveIntensity = 0
                    // console.log(child.material)
                }
            }
        })
        gltf.scene.position.copy(this.position);
        this.scene.add(gltf.scene);
    }

    init() {
        this.lavalamp.init()

        const gameExp = Experience.instance as GameExperience;
        gameExp.sceneManager.on("onIntroCompleted", () => {
            const targets = [this.door, this.doorGrabber].filter(Boolean);
            targets.forEach((obj) => {
                gsap.to(obj!.rotation, {
                    y: obj!.rotation.y + Math.PI / 2,
                    duration: 1.5,
                    ease: "power2.inOut",
                });
            });
        });
    }


    update() {
        this.lavalamp.update()
    }

}