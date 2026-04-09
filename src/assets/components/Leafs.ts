import { Experience } from "base-experience";
import * as THREE from "three"
import type { Resources } from "base-experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { alea } from 'seedrandom'
import type { Time } from "base-experience";
import type { Debug } from "base-experience";
import type GUI from "lil-gui";
import { Animation } from "base-experience";
const rng = new alea('foliage')

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
    private count = 3
    declare geometry: THREE.BufferGeometry
    declare power: 2

    constructor(name: string, resource: THREE.Texture) {
        if (!Experience.instance) {
            return;
        }

        this.texture = resource
        this.experience = Experience.instance
        this.debug = this.experience.debug

        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('🍃 Leaves manager')
            this.setDebugObject()
        }


        this.setGeometry()
        this.setModel()
    }

    setModel() {
        // const geometry = new THREE.PlaneGeometry(1, 1)
        const material = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: this.texture },
                power: { value: this.power }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                void main() {
                    vUv = uv;
                    // vNormal = normalize(normalMatrix * normal);
                    vNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);

                    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * modelViewMatrix * worldPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                varying vec2 vUv;
                varying vec3 vNormal;
                uniform float power;
                
                vec3 colorA = vec3(100./255., 125./255., 80./255.);
                vec3 colorB = vec3(70./255., 97./255., 56./255.);
                vec3 colorC = vec3(57./255., 83./255., 47./255.);
                vec3 colorD = vec3(16./255., 37./255., 22./255.);
                vec3 lightDirection = vec3(1., 10., 0.);

                float cubicOut(float t) {
                    float f = t - 1.0;
                    return f * f * f + 1.0;
                    }

                void main() {
                    vec4 color = texture2D(map, vUv);

                    float brightness = color.r;

                    if (brightness < 0.9) discard;

                    float NdotL = dot(normalize(vNormal), normalize(lightDirection));
                    // NdotL = clamp(NdotL, 0.0, 1.0);
                    // float mixStrength = pow(1.0 - smoothstep(0.0, 1.0, NdotL), power);
                    float mixStrength = NdotL;/// cubicOut(NdotL);

                    vec3 finalColor = mix(colorA, colorC, -mixStrength);


                    /**
                     * TODO : 
                     * Make the darker color less peresent than it actually is ( for exemple only for the 10 darker perncents.)
                    **/



                    /**
                        vec3 finalColor= colorC; 
                        if(mixStrength > 0.1){
                            finalColor = colorB;
                        }
                        if(mixStrength > 0.6){
                            finalColor =  colorA;
                        }
                    */





                    gl_FragColor = vec4(finalColor, 1.0);


                    // const mixStrength = normalWorld.dot(this.game.lighting.directionUniform).smoothstep(0, 1)
                    // return mix(this.colorANode, this.colorBNode, mixStrength)



                    // vec3 normalColor = normalize(vNormal) ;//* 0.5 + 0.5;
                    // gl_FragColor = vec4(normalColor, 1.0);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });



        const dummy = new THREE.Object3D();

        this.instance = new THREE.InstancedMesh(this.geometry, material, this.count);

        const matrix = new THREE.Matrix4();

        for (let i = 0; i < this.count; i++) {
            const width = Math.PI * 2 * 0.1

            let x = (Math.random() * Math.PI * 2) * 0.1 - width / 2
            let y = (Math.random() * Math.PI * 2) * 0.1 - width / 2
            let z = (Math.random() * Math.PI * 2) * 0.1 - width / 2

            if (i === 0) {

                x += - 0.8
                y += + 2
                z += - 0.7

            } else if (i === 1) {

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


    setDebugObject() {
        this.debugFolder
            .add(this, 'power')
            .name('shadow range')
            .min(1)
            .max(10)
            .step(1)
            .onChange(() => {

            })
    }

    setGeometry() {
        const count = 200
        const planes = []

        for (let i = 0; i < count; i++) {
            const plane = new THREE.PlaneGeometry(0.8, 0.8)

            // Position
            const spherical = new THREE.Spherical(
                Math.pow(rng(), 3) * 0.95,
                Math.PI * 2 * rng() * 0.95,
                Math.PI * rng() * 0.95
            )
            const position = new THREE.Vector3().setFromSpherical(spherical)

            plane.rotateZ(rng() * 9999)
            plane.rotateY(rng() * 9999)
            plane.rotateX(rng() * 9999)
            plane.translate(
                position.x,
                position.y,
                position.z
            )

            // Normal
            const normal = position.clone().normalize()
            const normalArray = new Float32Array(12)
            for (let i = 0; i < 4; i++) {
                const i3 = i * 3

                const position = new THREE.Vector3(
                    plane.attributes.position.array[i3],
                    plane.attributes.position.array[i3 + 1],
                    plane.attributes.position.array[i3 + 2],
                )

                const mixedNormal = position.lerp(normal, 0.85)

                normalArray[i3] = mixedNormal.x
                normalArray[i3 + 1] = mixedNormal.y
                normalArray[i3 + 2] = mixedNormal.z
            }

            plane.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3))

            // Save
            planes.push(plane)
        }

        // Merge all planes
        this.geometry = mergeGeometries(planes)
    }
}