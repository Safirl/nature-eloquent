import { Actor, Debug, EventEmitter, Experience, Resources, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import { Raycaster, Vector2, Vector3 } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three"

export default class InteractionManager extends EventEmitter implements LifeTimeObject {
    private declare selectedObject: Actor | undefined;
    public enabled: boolean = true;
    private declare experience: Experience
    private declare resources: Resources
    private position: Vector3 = new Vector3();
    private mousePosition = new Vector2()
    private declare debug: Debug;
    private declare debugFolder: GUI;
    private declare debugSphere: THREE.Mesh;

    constructor() {
        super()
        if (!Experience.instance) return;
        this.experience = Experience.instance;
        this.resources = this.experience.resources;
        this.selectedObject = new Actor("grass", this.resources.items.mushroomPaintedModel as GLTF);
        this.debug = this.experience.debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder("Interaction manager")
            this.debugFolder.close()
        }

        document.addEventListener("mousemove", this.updateMouseScreenPosition)
        document.addEventListener("mousedown", () => {
            // this.position = this.getSelectedObjectPosition();
            // this.me
        })
        this.setDebugObject()
        console.log(this.experience.camera.instance.layers)
    }

    init = () => { };
    update = () => {
        this.position = this.getSelectedObjectPosition();
    };

    destroy = () => { };

    setCurrentSelectedObject(newSelectedObject: Actor) {
        if (!newSelectedObject) return;
        if (this.selectedObject === newSelectedObject) return;
    }

    onPlayerPressed() {
        if (!this.selectedObject) return;
        this.trigger("placeObject");
    }

    onPlayerReleased() {
        if (!this.selectedObject) return;
        this.trigger("stopPlacingObject");
    }

    getSelectedObjectPosition(): Vector3 {
        const raycaster = new Raycaster()
        raycaster.layers.enable(1);
        raycaster.setFromCamera(this.mousePosition, this.experience.camera.instance)
        const intersections = raycaster.intersectObjects(this.experience.scene.children, true);
        if (intersections.length < 1) {
            return new Vector3();
        }
        console.log(intersections)
        const pos = intersections[0].point
        this.debugSphere.position.copy(pos)
        return new Vector3();
    }

    updateMouseScreenPosition = (event: MouseEvent) => {
        this.mousePosition = new Vector2(
            (event.clientX / this.experience.sizes.width * 2) - 1,
            -((event.clientY / this.experience.sizes.height * 2) - 1)
        )
    }

    setDebugObject() {
        if (!this.debug.active) return;
        this.debugSphere = new THREE.Mesh(new THREE.SphereGeometry(.3), new THREE.MeshBasicMaterial({ color: "red" }))
        this.debugSphere.layers.set(2);
        this.experience.scene.add(this.debugSphere);
    }
}