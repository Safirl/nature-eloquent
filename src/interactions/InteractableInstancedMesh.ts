import * as THREE from "three";

export default class InteractableInstancedMesh extends THREE.InstancedMesh {
	declare public isInteractable: boolean;
}
