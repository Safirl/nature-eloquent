import { Experience } from "base-experience";
import * as THREE from "three"
import type { Resources } from "base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import type { Time } from "base-experience";
import type { Debug } from "base-experience";
import type GUI from "lil-gui";
import { Animation } from "base-experience";
import Leafs from "./Leafs";
import BlockingWorld from "../../world/Blocking"
export default class Tree {
    declare experience: Experience
    declare scene: THREE.Scene
    declare resources: Resources
    declare resource: GLTF
    declare model: THREE.Object3D
    declare animation: Animation
    declare time: Time
    declare debug: Debug
    declare debugFolder: GUI
    declare name: string
    declare leafs: Leafs;
    declare world: BlockingWorld
    declare geometry: THREE.BufferGeometry;
    private count = 0
    declare instance: THREE.InstancedMesh;
    declare material: THREE.ShaderMaterial
    declare surface: number
    declare treeData: {
        rotationY: number
        position: {
            x: number
            y: number
            z: number

        }
    }[]

    constructor(
        name: string,
        instancingOption: {
            model: GLTF,
            count: number,
            surface: number
        }) {
        if (!Experience.instance) {
            return;
        }

        this.resource = instancingOption.model
        this.count = instancingOption.count
        this.surface = instancingOption.surface
        this.experience = Experience.instance
        this.world = this.experience.world as BlockingWorld
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.treeData = []
        this.setModel()
        this.setInstance()
    }

    setInstance() {


        const dummy = new THREE.Object3D();

        this.instance = new THREE.InstancedMesh(this.geometry, this.material, this.count);

        const matrix = new THREE.Matrix4();


        console.log(this.treeData)

        for (let i = 0; i < this.count; i++) {





            dummy.position.set(this.treeData[i].position.x, this.treeData[i].position.y, this.treeData[i].position.z);

            dummy.rotation.set(0, this.treeData[i].rotationY, 0)

            dummy.updateMatrix();


            matrix.copy(dummy.matrix);
            this.instance.setMatrixAt(i, matrix);

            this.instance.instanceMatrix.needsUpdate = true;


            this.scene.add(this.instance)



        }
    }

    setModel() {
        this.model = this.resource.scene
        // this.scene.add(this.model)
        console.log(this.model)
        this.model.traverse((child: any) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = false
                child.material = new THREE.MeshBasicMaterial({ color: "#ffffff" })
                this.geometry = child.geometry


                for (let i = 0; i < this.count; i++) {


                    this.treeData.push({
                        rotationY: 0,//Math.random() * Math.PI * 2,
                        position: {
                            x: (Math.random() * this.surface) - this.surface * 0.5,
                            y: 0,
                            z: (Math.random() * this.surface) - this.surface * 0.5
                        }
                    })

                }


            } else if (child.name.includes('leaves')) {
                for (let i = 0; i < this.count; i++) {


                    const v = child.position.clone();

                    v.x += this.treeData[i].position.x
                    v.y += this.treeData[i].position.y
                    v.z += this.treeData[i].position.z

                    this.world.bushes.addLeafPosition(v as THREE.Vector3)

                }

            }
        })
    }



    // update() {
    // // this.leafs.update()
    // }
}