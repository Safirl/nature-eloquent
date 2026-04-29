import { Actor, Debug, EventEmitter, Experience, Resources, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import { Raycaster, Vector2, Vector3 } from "three";
import type { GLTF, Octree } from "three/examples/jsm/Addons.js";
import * as THREE from "three"
import InstancedMeshManager from "./InstancedMeshManager";
import SubtitleManager from "../subtitle/SubtitleManager";
import dialogSubtitleAudio from "../subtitle/dialogSubtitleAudio.json"
import InteractableInstancedMesh from "./InteractableInstancedMesh";
import mushroomIcon from "../books/mushroom.png";
import mushroom2Icon from "../books/mushroom2.png";

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
    private buttonContainerId = "tool-selector"
    private InstancedMeshManagers: { name: string, manager: InstancedMeshManager }[] = []
    private keyboardBindings: { name: string, button: HTMLButtonElement }[] = []
    private lastPressedKeyIndex: number | null = null;

    private buttonIcons: { [key: string]: string } = {
        mushroom: mushroomIcon,
        mushroom2: mushroom2Icon,
        mushroomCouc: mushroomIcon,
    }

    // Subtitle manager
    private declare subtitle: SubtitleManager
    private declare dialogsAudio: { [key: string]: { [value: string]: { audio: string, dialog: string, speaker: string } } }

    declare worldOctree: Octree;

    constructor() {
        super()
        if (!Experience.instance) return;
        this.experience = Experience.instance;
        this.resources = this.experience.resources;

        this.subtitle = new SubtitleManager();
        this.dialogsAudio = dialogSubtitleAudio;

        const interactableObjects = [
            { name: "mushroom", resourceName: "mushroomPaintedModel" },
            { name: "mushroom2", resourceName: "mushroomModel" },
            { name: "mushroomCouc", resourceName: "mushroomPaintedModel" },
        ]

        // this.selectedObject = new Actor("mushroom", this.resources.items.mushroomPaintedModel as GLTF, false);
        this.debug = this.experience.debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder("Interaction manager")
            this.debugFolder.close()
        }

        this.experience.canvas.addEventListener("mousemove", this.updateMouseScreenPosition)
        this.experience.canvas.addEventListener("mouseup", this.addSelectedObject)
        document.addEventListener("keyup", this.onToolSelectorKeyUp)
        this.setDebugObject()
        this.updateInteractableObjects(interactableObjects)
        // this.selectedObject = "mushroom2";
    }

    onToolSelectorKeyUp = (event: KeyboardEvent) => {
        const keyIndex = parseInt(event.key) - 1

        const binding = this.keyboardBindings[keyIndex]
        if (!binding) return

        const buttonContainer = document.getElementById(this.buttonContainerId)
        if (!buttonContainer) return

        if (this.lastPressedKeyIndex === keyIndex) {
            this.selectedObject = ""
            this.updateActiveButton(buttonContainer, null)
            this.lastPressedKeyIndex = null
        } else {
            this.setCurrentSelectedObject(binding.name)
            this.updateActiveButton(buttonContainer, binding.button)
            this.lastPressedKeyIndex = keyIndex
        }

        event.preventDefault()
        event.stopPropagation()
        event.stopImmediatePropagation()
    }

    updateInteractableObjects(newResources: { name: string, resourceName: string }[]) {
        this.InstancedMeshManagers.forEach((pair) => {
            pair.manager.destroy()
        })
        const buttonContainer = document.getElementById(this.buttonContainerId);
        if (!buttonContainer) throw new Error("Can't refresh buttons: buttonContainer is null");

        buttonContainer.innerHTML = '';
        this.InstancedMeshManagers = [];
        this.keyboardBindings = [];

        newResources.forEach((pair) => {
            const resource = this.experience.resources.items[pair.resourceName] as GLTF
            if (!resource) {
                console.warn("found invalid resource for: ", pair.resourceName);
                return;
            }
            const instancedMeshManager = new InstancedMeshManager(resource.scene.children[0] as THREE.Mesh)
            this.InstancedMeshManagers.push({ name: pair.name, manager: instancedMeshManager })

            const button = document.createElement('button')
            button.style.marginRight = '4px'
            button.innerHTML = pair.name
            button.classList.remove("active")

            const objectImage = document.createElement('img')
            objectImage.src = this.buttonIcons[pair.name];
            console.log("objectImage src: ", objectImage.src);
            objectImage.style.width = '40px';
            objectImage.style.height = '40px';
            objectImage.style.objectFit = 'cover';
            objectImage.style.marginRight = '4px';
            button.appendChild(objectImage);

            buttonContainer.appendChild(button)
            // button.onclick = (event) => {
            //     this.setCurrentSelectedObject(pair.name)
            //     this.updateActiveButton(buttonContainer, button)
            //     event.preventDefault()
            //     event.stopPropagation();
            //     event.stopImmediatePropagation();
            // }
            this.keyboardBindings.push({ name: pair.name, button })
        }
        )
    }

    updateActiveButton(container: HTMLElement, activeButton: HTMLElement | null = null) {
        for (const child of container.children) {
            if (child === activeButton) {
                child.classList.add("active")
            } else {
                child.classList.remove("active")
            }
        }
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
        document.removeEventListener("keyup", this.onToolSelectorKeyUp)
        this.InstancedMeshManagers.forEach((pair) => {
            pair.manager.destroy()
        })
    };

    setCurrentSelectedObject(newSelectedObject: string) {
        if (!newSelectedObject) return;
        this.selectedObject = newSelectedObject;
    }

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

        // EX d'enchaînement du dialogue et en fonction du nombre d'objets placés
        // Logique à mettre dans une autre fonction ?
        if (this.selectedObject !== "mushroom") return;

        if (instancedMeshManager.count === 1) {
            this.subtitle.displayDialog(this.dialogsAudio.dinosaur_interaction_1)
        } else if (instancedMeshManager.count === 5) {
            this.subtitle.displayDialog(this.dialogsAudio.dinosaur_interaction_2)
        }

    }

    onPlayerReleased = () => {
        if (!this.selectedObject) return;
        this.trigger("stopPlacingObject");
    }

    getSelectedObjectPosition(): Vector3 | undefined {
        const raycaster = new Raycaster(new THREE.Vector3(), new THREE.Vector3(), 0, 20)
        raycaster.layers.enable(1);

        raycaster.ray.origin.copy(this.experience.camera.instance.position);
        this.experience.camera.instance.getWorldDirection(raycaster.ray.direction);

        // Si on joue en god mode -> pour l'ajout à la souris
        // raycaster.setFromCamera(this.mousePosition, this.experience.camera.instance)

        // let objectsToIntersect = this.experience.scene.children
        // objectsToIntersect = objectsToIntersect.concat([this.InstancedMeshManagers[0].manager.mesh])
        const intersections = raycaster.intersectObjects(this.experience.scene.children, true);
        if (intersections.length < 1) {
            return undefined;
        }
        if (intersections[0].object instanceof InteractableInstancedMesh && intersections[0].object.isInteractable === false) {
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