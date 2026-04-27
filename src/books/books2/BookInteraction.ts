import { EventEmitter, Experience } from 'base-experience';
import type InteractableObject from '../../interactable/InteractableObject';

export default class BookInteraction extends EventEmitter {
    constructor() {
        super();
        this.registerEventBook();
    }

    /* 
    REGISTER BIND INPUT EVENTS
    */

    private registerEventBook(): void {
        if (!Experience.instance) return;
        this.registerEventProximityDetection(Experience.instance);
    }

    private registerEventProximityDetection(instance: Experience): void {
        instance.camera.on("onSelectedObjectChanged", (args: (InteractableObject | null)[]) => {
            const object = Array.isArray(args) ? args[0] : args;
            if (!object) {

            }
        });
    }
}
