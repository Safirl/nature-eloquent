import { Actor, Debug, EventEmitter, Experience, Resources, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import { Raycaster, Vector2, Vector3 } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three"
import InstancedMeshManager from "./InstancedMeshManager";

export default class InteractionManager extends EventEmitter implements LifeTimeObject {
    private declare selectedObject: Actor | undefined;
    public enabled: boolean = true;
    private declare experience: Experience
    private declare resources: Resources
    private markerPosition: Vector3 = new Vector3();
    private mousePosition = new Vector2()
    private declare debug: Debug;
    private declare debugFolder: GUI;
    private declare debugSphere: THREE.Mesh;

    private declare interactableObjects: { name: string, manager: InstancedMeshManager }[]

    constructor() {
        super()
        if (!Experience.instance) return;
        this.experience = Experience.instance;
        this.resources = this.experience.resources;
        this.selectedObject = new Actor("mushroom", this.resources.items.mushroomPaintedModel as GLTF, false);
        this.debug = this.experience.debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder("Interaction manager")
            this.debugFolder.close()
        }

        document.addEventListener("mousemove", this.updateMouseScreenPosition)
        document.addEventListener("mouseup", this.addSelectedObject)
        this.setDebugObject()
    }

    updateInteractableObjects(newResources: { name: string, resourceName: string }[]) {
        this.interactableObjects.forEach((pair) => {
            pair.manager.destroy()
        })
        this.interactableObjects = [];
        newResources.forEach((pair) => {
            const resource = this.experience.resources.items[pair.resourceName] as GLTF
            if (!resource) {
                console.warn("found invalid resource for: ", pair.resourceName);
                return;
            }
            const instancedMeshManager = new InstancedMeshManager(resource.scene.children[0] as THREE.Mesh)
            this.interactableObjects.push({ name: pair.name, manager: instancedMeshManager })
        })
    }

    init = () => { };
    update = () => {
        this.markerPosition = this.getSelectedObjectPosition();
        if (this.debug.active) {
            this.debugSphere.position.copy(this.markerPosition)
        }
    };

    destroy = () => {
        this.interactableObjects.forEach((pair) => {
            pair.manager.destroy()
        })
    };

    setCurrentSelectedObject(newSelectedObject: Actor) {
        if (!newSelectedObject) return;
        if (this.selectedObject === newSelectedObject) return;
    }

    addSelectedObject = (e: MouseEvent) => {
        if (!this.selectedObject) return;
        if (!this.markerPosition) return;
        if (e.button === 2) return;
        this.selectedObject.setPosition(this.markerPosition.x, this.markerPosition.y, this.markerPosition.z)
        // const mesh = this.selectedObject.model.children[0] as THREE.Mesh
        // const instance = new THREE.InstancedMesh(mesh.geometry, mesh.material, 1)
        // // instance.add()
        // // instance.
        this.experience.scene.add(this.selectedObject.model)
        this.trigger("placeObject", [this.selectedObject]);
    }

    onPlayerReleased = () => {
        if (!this.selectedObject) return;
        this.trigger("stopPlacingObject");
    }

    getSelectedObjectPosition(): Vector3 {
        const raycaster = new Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 20)
        raycaster.layers.enable(1);
        raycaster.setFromCamera(this.mousePosition, this.experience.camera.instance)
        const intersections = raycaster.intersectObjects(this.experience.scene.children, true);
        if (intersections.length < 1) {
            return new Vector3();
        }
        const pos = intersections[0].point
        return pos;
    }

    updateMouseScreenPosition = (event: MouseEvent) => {
        this.mousePosition = new Vector2(
            (event.clientX / this.experience.sizes.width * 2) - 1,
            -((event.clientY / this.experience.sizes.height * 2) - 1)
        )
    }

    setDebugObject() {
        if (!this.debug.active) return;
        this.debugSphere = new THREE.Mesh(new THREE.SphereGeometry(.1), new THREE.MeshBasicMaterial({ color: "red" }))
        this.debugSphere.layers.set(2);
        this.experience.scene.add(this.debugSphere);
    }
}