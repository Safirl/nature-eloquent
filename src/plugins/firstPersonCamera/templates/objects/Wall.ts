import { StaticObject } from "@plugins/baseExperience";
import * as THREE from "three";

export default class Wall extends StaticObject {
	setGeometry() {
		this.geometry = new THREE.BoxGeometry(10, 2, 0.5);
	}

	setMaterial(): void {
		this.material = new THREE.MeshStandardMaterial({
			color: new THREE.Color("red"),
		});
	}

	setMesh(): void {
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.castShadow = true;
		this.scene.add(this.mesh);
	}
}
