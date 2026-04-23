import type { LifeTimeObject } from "@plugins/baseExperience";
import * as THREE from "three"

export default class InstancedMeshManager implements LifeTimeObject {
    public declare mesh: THREE.InstancedMesh
    private count = 0;
    private dummy = new THREE.Object3D()

    constructor(baseObject: THREE.Mesh, max = 500) {
        this.mesh = new THREE.InstancedMesh(baseObject.geometry, baseObject.material, max)
        // this.dummy = baseObject
        this.count = 0
        this.mesh.count = 0
    }

    add(position: THREE.Vector3) {
        this.dummy.position.copy(position)
        this.dummy.updateMatrix()
        this.mesh.setMatrixAt(this.count, this.dummy.matrix)
        this.mesh.instanceMatrix.needsUpdate = true;

        this.count++
    }

    init = () => { };
    update = () => { };
    destroy = () => {
        this.mesh.dispose();
    };
}