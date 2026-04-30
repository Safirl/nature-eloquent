import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import * as THREE from "three";
import InteractableInstancedMesh from "./InteractableInstancedMesh";

export default class InstancedMeshManager implements LifeTimeObject {
	public meshes: InteractableInstancedMesh[] = [];
	public count = 0;
	declare private max;
	private dummy = new THREE.Object3D();
	private collisionMeshes: THREE.Mesh[] = [];
	declare private experience: Experience;

	constructor(
		baseObject: THREE.Mesh | THREE.Group,
		max = 500,
		hasCollisions = false
	) {
		if (!Experience.instance) return;
		this.experience = Experience.instance;
		this.count = 0;
		this.max = max;
		if (baseObject instanceof THREE.Group) {
			baseObject.children.forEach((c) => {
				const mesh = c as THREE.Mesh;
				if (!mesh) return;
				this.createInstanceMesh(mesh, max, hasCollisions);
			});
		} else {
			this.createInstanceMesh(baseObject, max, hasCollisions);
		}
	}

	createInstanceMesh(
		baseObject: THREE.Mesh,
		max: number,
		hasCollisions: boolean
	) {
		const material = baseObject.material as THREE.Material;
		if (material.transparent) {
			material.transparent = false;
			material.alphaTest = 0.5;
			material.depthWrite = true;
		}
		const index = this.meshes.push(
			new InteractableInstancedMesh(
				baseObject.geometry,
				baseObject.material,
				max
			)
		);
		let createdMesh = this.meshes[index - 1];

		createdMesh.castShadow = true;
		createdMesh.receiveShadow = true;
		createdMesh.count = this.count;
		this.experience.scene.add(createdMesh);
		if (hasCollisions) {
			this.collisionMeshes[index - 1] = baseObject.clone();
		}
	}

	add(position: THREE.Vector3) {
		if (this.count == this.max) {
			console.warn("maxium instances reached !");
			return;
		}
		this.dummy.position.copy(position);
		this.dummy.updateMatrix();
		this.meshes.forEach((m, i) => {
			m.setMatrixAt(this.count, this.dummy.matrix);
			m.count++;
			m.instanceMatrix.needsUpdate = true;
			m.computeBoundingSphere();
			m.computeBoundingBox();

			const collisionMesh = this.collisionMeshes[i];
			if (collisionMesh) {
				collisionMesh.position.copy(position);
				this.experience.collisionManager.worldOctree.fromGraphNode(
					collisionMesh
				);
			}
		});
		this.count++;
	}

	init = () => {};
	update = () => {};
	destroy = () => {
		this.meshes.forEach((m) => {
			m.dispose();
		});
	};
}
