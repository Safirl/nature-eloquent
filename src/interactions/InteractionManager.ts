import { Actor, EventEmitter, type LifeTimeObject } from "@plugins/baseExperience";

export default class InteractionManager extends EventEmitter implements LifeTimeObject {    
    private selectedObject: Actor | undefined;
    
    init = () => void {};
    update = () => void {};
    destroy = () => void {};

    setCurrentSelectedObject() {

    }

    onPlayerPressed() {
        if (!this.selectedObject) return;
        this.trigger("placeObject");
    }

    onPlayerReleased() {
        if (!this.selectedObject) return;
        this.trigger("stopPlacingObject");
    }

    getSelectedObjectPosition() {}
}