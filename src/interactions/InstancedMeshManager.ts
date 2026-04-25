import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import * as THREE from "three"

export default class InstancedMeshManager implements LifeTimeObject {
    public declare mesh: THREE.InstancedMesh
    private count = 0;
    private dummy = new THREE.Object3D()
    private declare experience: Experience

    constructor(baseObject: THREE.Mesh, max = 500) {
        if (!Experience.instance) return;
        this.experience = Experience.instance

        this.mesh = new THREE.InstancedMesh(baseObject.geometry, baseObject.material, max)
        // this.mesh.frustumCulled = false;
        // this.dummy = baseObject
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.count = 0
        this.mesh.count = this.count
        this.experience.scene.add(this.mesh)
    }

    add(position: THREE.Vector3) {
        this.dummy.position.copy(position)
        this.dummy.updateMatrix()
        this.mesh.setMatrixAt(this.count, this.dummy.matrix)
        this.count++
        this.mesh.count = this.count;
        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.computeBoundingSphere()
        this.mesh.computeBoundingBox()
    }

    init = () => { };
    update = () => { };
    destroy = () => {
        this.mesh.dispose();
    };
}