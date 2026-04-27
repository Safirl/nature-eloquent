import { Actor, Debug, EventEmitter, Experience, Resources, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import { Raycaster, Vector2, Vector3 } from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three"
import InstancedMeshManager from "./InstancedMeshManager";
import SubtitleManager from "../subtitle/SubtitleManager";

export default class InteractionManager extends EventEmitter implements LifeTimeObject {
    private declare selectedObject: string;
    public enabled: boolean = true;
    private declare experience: Experience
    private declare resources: Resources
    private declare markerPosition: Vector3 | undefined;
    private mousePosition = new Vector2()
    private declare debug: Debug;
    private declare debugFolder: GUI;
    private declare debugSphere: THREE.Mesh;
    private declare subtitle: SubtitleManager
    private declare dialogs: { [key: string]: { dialog: string, dialog2: string } }

    private InstancedMeshManagers: { name: string, manager: InstancedMeshManager }[] = []

    constructor() {
        super()
        if (!Experience.instance) return;
        this.experience = Experience.instance;
        this.resources = this.experience.resources;
        this.subtitle = new SubtitleManager();
        // this.selectedObject = new Actor("mushroom", this.resources.items.mushroomPaintedModel as GLTF, false);
        this.debug = this.experience.debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder("Interaction manager")
            this.debugFolder.close()
        }

        document.addEventListener("mousemove", this.updateMouseScreenPosition)
        document.addEventListener("mouseup", this.addSelectedObject)
        this.setDebugObject()
        this.updateInteractableObjects([{ name: "mushroom", resourceName: "mushroomPaintedModel" }])
        this.selectedObject = "mushroom";
    }

    updateInteractableObjects(newResources: { name: string, resourceName: string }[]) {
        this.InstancedMeshManagers.forEach((pair) => {
            pair.manager.destroy()
        })
        this.InstancedMeshManagers = [];
        newResources.forEach((pair) => {
            const resource = this.experience.resources.items[pair.resourceName] as GLTF
            if (!resource) {
                console.warn("found invalid resource for: ", pair.resourceName);
                return;
            }
            const instancedMeshManager = new InstancedMeshManager(resource.scene.children[0] as THREE.Mesh)
            this.InstancedMeshManagers.push({ name: pair.name, manager: instancedMeshManager })
        })
    }

    init = () => {
    };
    update = () => {
        this.markerPosition = this.getSelectedObjectPosition();
        if (!this.markerPosition) return;
        if (this.debug.active) {
            this.debugSphere.position.copy(this.markerPosition)
        }
    };

    destroy = () => {
        this.InstancedMeshManagers.forEach((pair) => {
            pair.manager.destroy()
        })
    };

    // setCurrentSelectedObject(newSelectedObject: Actor) {
    //     if (!newSelectedObject) return;
    //     if (this.selectedObject === newSelectedObject) return;
    // }

    addSelectedObject = (e: MouseEvent) => {
        if (!this.selectedObject) return;
        if (!this.markerPosition) return;
        if (e.button === 2) return;

        const instancedMeshManager = this.InstancedMeshManagers.find((m) => m.name === this.selectedObject)?.manager;
        if (!instancedMeshManager) return;

        instancedMeshManager.add(this.markerPosition);
        // this.selectedObject.setPosition(this.markerPosition.x, this.markerPosition.y, this.markerPosition.z)
        // const mesh = this.selectedObject.model.children[0] as THREE.Mesh
        // const instance = new THREE.InstancedMesh(mesh.geometry, mesh.material, 1)
        // // instance.add()
        // // instance.
        // this.experience.scene.add(this.selectedObject.model)
        // this.trigger("placeObject", [this.selectedObject]);
        this.subtitle.displayDialog("placed object: " + this.selectedObject)
    }

    onPlayerReleased = () => {
        if (!this.selectedObject) return;
        this.trigger("stopPlacingObject");
    }

    getSelectedObjectPosition(): Vector3 | undefined {
        const raycaster = new Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 20)
        raycaster.layers.enable(1);
        raycaster.setFromCamera(this.mousePosition, this.experience.camera.instance)
        // let objectsToIntersect = this.experience.scene.children
        // objectsToIntersect = objectsToIntersect.concat([this.InstancedMeshManagers[0].manager.mesh])
        const intersections = raycaster.intersectObjects(this.experience.scene.children, true);
        if (intersections.length < 1) {
            return undefined;
        }
        return intersections[0].point;
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