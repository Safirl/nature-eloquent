import { Experience } from "base-experience";
import * as THREE from "three"
import type { Resources } from "base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import type { Time } from "base-experience";
import type { Debug } from "base-experience";
import type GUI from "lil-gui";
import { Animation } from "base-experience";

export default class Leafs {
    declare experience: Experience
    declare scene: THREE.Scene
    declare resources: Resources
    declare texture: THREE.Texture
    declare instance: THREE.InstancedMesh
    declare animation: Animation
    declare time: Time
    declare debug: Debug
    declare debugFolder: GUI
    declare name: string
    private count = 30

    constructor(name: string, resource: THREE.Texture) {
        if (!Experience.instance) {
            return;
        }

        this.texture = resource
        this.experience = Experience.instance

        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.setModel()
    }

    setModel() {
        const geometry = new THREE.PlaneGeometry(1, 1)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: this.texture }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                varying vec2 vUv;

                void main() {
                    vec4 color = texture2D(map, vUv);

                    float brightness = color.r;

                    // Dark = transparent
                    if (brightness < 0.9) discard;

                    gl_FragColor = color ;//* vec4(0., 1., 0., 1.);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });



        const dummy = new THREE.Object3D();

        this.instance = new THREE.InstancedMesh(geometry, material, this.count);

        const matrix = new THREE.Matrix4();

        for (let i = 0; i < this.count; i++) {
            const width = Math.PI * 2 * 0.1

            let x = (Math.random() * Math.PI * 2) * 0.1 - width / 2
            let y = (Math.random() * Math.PI * 2) * 0.1 - width / 2
            let z = (Math.random() * Math.PI * 2) * 0.1 - width / 2

            if (i < this.count / 3) {

                x += - 0.8
                y += + 2
                z += - 0.7

            } else if (i < this.count / 3 * 2) {

                x += 0.8
                y += 4
                z += + 0.3

            } else {

                x += -0.2
                y += 3
                z += + 1

            }


            console.log("on est passé here")

            dummy.position.set(x, y, z);

            dummy.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2)

            dummy.updateMatrix();


            matrix.copy(dummy.matrix);
            this.instance.setMatrixAt(i, matrix);
        }

        this.instance.instanceMatrix.needsUpdate = true;


        this.scene.add(this.instance)
    }

}