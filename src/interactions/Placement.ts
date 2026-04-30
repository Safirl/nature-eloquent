import { Experience } from "@plugins/baseExperience";
import { Raycaster, Vector3 } from "three";
import * as THREE from "three";
import InstancedMeshManager from "./InstancedMeshManager";
import InteractableInstancedMesh from "./InteractableInstancedMesh";

/**
 * Placement — generic Three.js placement primitive.
 *
 * Responsibility: maintains a registry of InstancedMeshManagers keyed by an
 * arbitrary string id, computes a placement marker each frame via
 * camera-direction raycasting, and adds an instance at the marker on
 * demand. Knows nothing about Menu, items, or any specific subsystem — it
 * is a reusable building block any interaction system can own.
 */
export default class Placement {
	private experience: Experience;
	private managers: Map<string, InstancedMeshManager> = new Map();
	private markerPosition: Vector3 | undefined;
	private debugSphere: THREE.Mesh | undefined;

	constructor() {
		if (!Experience.instance)
			throw new Error("Placement: Experience is not initialized");
		this.experience = Experience.instance;
		this.setupDebug();
	}

	register(id: string, baseMesh: THREE.Mesh) {
		this.unregister(id);
		const manager = new InstancedMeshManager(baseMesh);
		this.managers.set(id, manager);
	}

	unregister(id: string) {
		const manager = this.managers.get(id);
		if (!manager) return;
		manager.destroy();
		this.managers.delete(id);
	}

	unregisterAll() {
		for (const manager of this.managers.values()) manager.destroy();
		this.managers.clear();
	}

	place(id: string): number | null {
		if (!id) return null;
		if (!this.markerPosition) return null;
		const manager = this.managers.get(id);
		if (!manager) return null;
		manager.add(this.markerPosition);
		return manager.count;
	}

	getCount(id: string): number {
		return this.managers.get(id)?.count ?? 0;
	}

	getMarkerPosition(): Vector3 | undefined {
		return this.markerPosition;
	}

	update() {
		this.markerPosition = this.computeMarkerPosition();
		if (!this.markerPosition) return;
		if (this.debugSphere) {
			this.debugSphere.position.copy(this.markerPosition);
		}
	}

	private computeMarkerPosition(): Vector3 | undefined {
		const raycaster = new Raycaster(
			new THREE.Vector3(),
			new THREE.Vector3(),
			0,
			20
		);
		raycaster.layers.enable(1);

		raycaster.ray.origin.copy(this.experience.camera.instance.position);
		this.experience.camera.instance.getWorldDirection(
			raycaster.ray.direction
		);

		const intersections = raycaster.intersectObjects(
			this.experience.scene.children,
			true
		);
		if (intersections.length < 1) return undefined;
		if (
			intersections[0].object instanceof InteractableInstancedMesh &&
			intersections[0].object.isInteractable === false
		) {
			return undefined;
		}
		return intersections[0].point;
	}

	private setupDebug() {
		if (!this.experience.debug.active) return;
		this.debugSphere = new THREE.Mesh(
			new THREE.SphereGeometry(0.1),
			new THREE.MeshBasicMaterial({ color: "red" })
		);
		this.debugSphere.layers.set(2);
		this.experience.scene.add(this.debugSphere);
	}

	destroy() {
		this.unregisterAll();
		if (this.debugSphere) {
			this.experience.scene.remove(this.debugSphere);
			this.debugSphere = undefined;
		}
	}
}
