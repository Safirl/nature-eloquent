import * as THREE from "three"

export default class InteractableInstancedMesh extends THREE.InstancedMesh {
    public declare isInteractable: boolean;
}