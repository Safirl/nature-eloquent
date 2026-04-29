import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import * as THREE from "three";
import InteractableInstancedMesh from "./InteractableInstancedMesh";

export default class InstancedMeshManager implements LifeTimeObject {
	declare public mesh: InteractableInstancedMesh;
	public count = 0; // Changement en public (?) -> pour pouvoir l'appeler dans InteractionManager
	private dummy = new THREE.Object3D();
	declare private collisionMesh: THREE.Mesh;
	declare private experience: Experience;

	constructor(baseObject: THREE.Mesh, max = 500, hasCollisions = true) {
		if (!Experience.instance) return;
		this.experience = Experience.instance;
		const material = baseObject.material as THREE.MeshStandardMaterial;
		material.wireframe = true;

		this.mesh = new InteractableInstancedMesh(
			baseObject.geometry,
			material,
			max
		);
		this.mesh.isInteractable = false;
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = true;
		this.count = 0;
		this.mesh.count = this.count;
		this.experience.scene.add(this.mesh);
		if (hasCollisions) {
			this.collisionMesh = baseObject.clone();
		}
	}

	add(position: THREE.Vector3) {
		this.dummy.position.copy(position);
		this.dummy.updateMatrix();
		this.mesh.setMatrixAt(this.count, this.dummy.matrix);
		this.count++;
		this.mesh.count = this.count;
		this.mesh.instanceMatrix.needsUpdate = true;
		this.mesh.computeBoundingSphere();
		this.mesh.computeBoundingBox();
		if (this.collisionMesh) {
			this.collisionMesh.position.copy(position);
			this.experience.collisionManager.worldOctree.fromGraphNode(
				this.collisionMesh
			);
		}
	}

	init = () => {};
	update = () => {};
	destroy = () => {
		this.mesh.dispose();
	};
}
