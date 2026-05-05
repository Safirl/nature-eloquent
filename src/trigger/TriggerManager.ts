import { Experience } from "@plugins/baseExperience";
import * as THREE from "three";

export default class TriggerManager {
    declare experience: Experience;
    constructor() {
        if (!Experience.instance) throw new Error("TriggerManager: Experience not initialized");
        this.experience = Experience.instance;
        this.init();
    }
    init() {
        this.createTriggerZone({ x: 0, y: 0, z: 2 }, { width: 2, height: 2, depth: 2 });
    }

    createTriggerZone(position: { x: number, y: number, z: number }, size: { width: number, height: number, depth: number }) {
        const geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const triggerZone = new THREE.Mesh(geometry, material);
        triggerZone.position.set(position.x, position.y, position.z);
        this.experience.scene.add(triggerZone);
    }

    update() {

    }
}