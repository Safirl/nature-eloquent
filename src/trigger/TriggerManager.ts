import { Experience } from "@plugins/baseExperience";
import type { FirstPersonCameraOctree } from "@plugins/firstPersonCamera";
import * as THREE from "three";

type TriggerZone = {
    box: THREE.Box3,
    isInZone: boolean,
    onEnter: () => void,
    // onExit: () => void
}

export default class TriggerManager {
    declare experience: Experience;
    declare allTriggers: TriggerZone[];
    constructor() {
        if (!Experience.instance) throw new Error("TriggerManager: Experience not initialized");
        this.experience = Experience.instance;
        this.allTriggers = [];
        this.init();
    }

    init() {
        this.createTriggerZone({ x: 5, y: 2, z: 0 }, { width: 1, height: 5, depth: 2 }, () => console.log("TRIGGER DIALOGUE 1"));
        this.createTriggerZone({ x: 9, y: 2, z: 0 }, { width: 1, height: 5, depth: 2 }, () => console.log("TRIGGER DIALOGUE 2"));
    }

    createTriggerZone(position: { x: number, y: number, z: number }, size: { width: number, height: number, depth: number }, callbackOnEnter: () => void) {
        const geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const triggerZone = new THREE.Mesh(geometry, material);
        triggerZone.position.set(position.x, position.y, position.z);
        this.experience.scene.add(triggerZone);

        const triggerZoneBox = new THREE.Box3().setFromObject(triggerZone);
        this.allTriggers.push({
            box: triggerZoneBox,
            isInZone: false,
            onEnter: callbackOnEnter,
            // onExit: () => console.log("Exited trigger zone")
        });

        return triggerZone;
    }

    checkTrigger(playerBox: THREE.Box3, triggerBox: TriggerZone) {
        const isIntersecting = triggerBox.box.intersectsBox(playerBox);
        if (isIntersecting && !triggerBox.isInZone) {
            triggerBox.isInZone = true;
            triggerBox.onEnter();
        } else if (!isIntersecting && triggerBox.isInZone) {
            triggerBox.isInZone = false;
            // triggerBox.onExit();
        }
    }

    update() {
        const camera = this.experience.camera as FirstPersonCameraOctree;
        for (const trigger of this.allTriggers) {
            this.checkTrigger(camera.playerBox, trigger);
        }
    }
}

// à voir : https://jainmanshu.medium.com/exploring-collision-detection-in-three-js-82dc95a383f4