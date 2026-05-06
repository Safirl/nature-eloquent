import { Experience } from "@plugins/baseExperience";
import type { FirstPersonCameraOctree } from "@plugins/firstPersonCamera";
import * as THREE from "three";

export default class TriggerManager {
    declare experience: Experience;
    declare triggerZoneBox: THREE.Box3;
    declare isInTriggerZone: boolean;
    declare allTriggers: {
        box: THREE.Box3,
        onEnter: () => void,
        onExit: () => void
    }[];
    constructor() {
        if (!Experience.instance) throw new Error("TriggerManager: Experience not initialized");
        this.experience = Experience.instance;
        this.init();
    }
    init() {
        const triggerZone = this.createTriggerZone(
            { x: 0, y: 0, z: 2 },
            { width: 2, height: 10, depth: 2 }
        );
        this.triggerZoneBox = this.addBoundingBox(triggerZone);
    }

    createTriggerZone(position: { x: number, y: number, z: number }, size: { width: number, height: number, depth: number }) {
        const geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const triggerZone = new THREE.Mesh(geometry, material);
        triggerZone.position.set(position.x, position.y, position.z);
        this.experience.scene.add(triggerZone);
        return triggerZone;
    }

    addBoundingBox(triggerZone: THREE.Mesh) {
        const triggerZoneBox = new THREE.Box3();
        return triggerZoneBox.setFromObject(triggerZone);
    }


    checkTrigger(playerBox: THREE.Box3, triggerZoneBox: THREE.Box3) {
        if (triggerZoneBox.intersectsBox(playerBox) && !this.isInTriggerZone) {
            this.isInTriggerZone = true;
            console.log("entrer")
        } else if (!triggerZoneBox.intersectsBox(playerBox) && this.isInTriggerZone) {
            this.isInTriggerZone = false;
            console.log("sortie")
        }
    }

    update() {
        const camera = this.experience.camera as FirstPersonCameraOctree;
        this.checkTrigger(camera.playerBox, this.triggerZoneBox);
    }
}

// à voir : https://jainmanshu.medium.com/exploring-collision-detection-in-three-js-82dc95a383f4