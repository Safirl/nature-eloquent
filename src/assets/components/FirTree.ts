import { Experience } from "base-experience";
import * as THREE from "three"
import type { Time } from "base-experience";
import type { Resources } from "base-experience";
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { alea } from 'seedrandom'

const rng = new alea('firtree')

export default class FirTree {
    declare experience: Experience
    declare scene: THREE.Scene
    declare time: Time
    declare resources: Resources
    declare texture: THREE.Texture
    private count = 0
    declare surface: number
    declare trunkGeometry: THREE.BufferGeometry
    declare branchGeometry: THREE.BufferGeometry
    declare trunkMaterial: THREE.MeshBasicMaterial
    declare branchMaterial: THREE.ShaderMaterial
    declare trunkInstance: THREE.InstancedMesh
    declare branchInstance: THREE.InstancedMesh
    declare instances: { x: number; z: number; rotationY: number; scale: number }[]

    constructor(count: number, surface: number) {
        if (!Experience.instance) return

        this.count = count
        this.surface = surface
        this.experience = Experience.instance
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.resources = this.experience.resources
        this.texture = this.resources.items.leafs_texture as THREE.Texture

        this.generateInstances()
        this.setTrunk()
        this.setBranches()
    }

    private generateInstances() {
        this.instances = []
        for (let i = 0; i < this.count; i++) {
            this.instances.push({
                x: (Math.random() * this.surface) - this.surface * 0.5,
                z: (Math.random() * this.surface) - this.surface * 0.5,
                rotationY: Math.random() * Math.PI * 2,
                scale: 0.55 + Math.random() * 0.9
            })
        }
    }

    private setTrunk() {
        this.trunkGeometry = new THREE.CylinderGeometry(0.08, 0.22, 3.5, 7)
        this.trunkGeometry.translate(0, 1.75, 0)

        this.trunkMaterial = new THREE.MeshBasicMaterial({ color: "#1a0f08" })

        this.trunkInstance = new THREE.InstancedMesh(this.trunkGeometry, this.trunkMaterial, this.count)

        const dummy = new THREE.Object3D()
        for (let i = 0; i < this.count; i++) {
            const { x, z, rotationY, scale } = this.instances[i]
            dummy.position.set(x, 0, z)
            dummy.rotation.set(0, rotationY, 0)
            dummy.scale.setScalar(scale)
            dummy.updateMatrix()
            this.trunkInstance.setMatrixAt(i, dummy.matrix)
        }
        this.trunkInstance.instanceMatrix.needsUpdate = true
        this.scene.add(this.trunkInstance)
    }

    private setBranches() {
        const levels = 12
        const branchesPerLevel = 5
        const planesPerBranch = 70   // planes scattered around each branch axis
        const startH = 1.5 + 3
        const endH = 7.8 + 3
        const parts: THREE.BufferGeometry[] = []

        for (let l = 0; l < levels; l++) {
            const t = l / (levels - 1)   // 0 = bottom, 1 = top

            const y = startH + t * (endH - startH)
            const branchLength = 3.5 - t * 3.15
            const droop = 0.28 - t * 0.22  // droops more at the bottom

            for (let b = 0; b < branchesPerLevel; b++) {
                // Spiral so branches at adjacent levels don't stack
                const angle = (b / branchesPerLevel) * Math.PI * 2 + l * 0.37

                // Branch axis direction (outward + droop)
                const bx = Math.cos(angle)
                const by = -Math.sin(droop)
                const bz = Math.sin(angle)

                // Perpendicular vectors for radial spread around the branch axis
                const rx = -Math.sin(angle) // 90° in XZ plane
                const rz = Math.cos(angle)

                console.log(Math.trunc(planesPerBranch * Math.pow(1 - t, 1.5)))

                for (let p = 0; p < Math.trunc(planesPerBranch * Math.pow(1 - t, 1)); p++) {
                    // Distribute planes from near the trunk to the tip
                    const along = ((p + rng() * 0.6) / planesPerBranch) * branchLength

                    // Radial spread grows slightly toward mid-branch then shrinks at tip
                    const spreadEnvelope = Math.sin((along / branchLength) * Math.PI) * 0.35 + 0.05
                    const spreadR = rng() * spreadEnvelope * branchLength
                    const spreadA = rng() * Math.PI * 2

                    const planeSize = 0.8//branchLength * 0.55 * (1.0 - (along / branchLength) * 0.35)

                    const px = Math.cos(angle) * 0.15 + bx * along + rx * spreadR * Math.cos(spreadA)
                    const py = y + by * along + spreadR * Math.sin(spreadA) * 0.4
                    const pz = Math.sin(angle) * 0.15 + bz * along + rz * spreadR * Math.cos(spreadA)

                    const plane = new THREE.PlaneGeometry(planeSize, planeSize)

                    // Fully random orientation — texture mask makes it look like foliage
                    plane.rotateZ(rng() * Math.PI * 2)
                    plane.rotateY(rng() * Math.PI * 2)
                    plane.rotateX(rng() * Math.PI * 2)

                    plane.translate(px, py, pz)
                    parts.push(plane)
                }
            }
        }

        this.branchGeometry = mergeGeometries(parts)

        this.branchMaterial = new THREE.ShaderMaterial({
            uniforms: {
                map: { value: this.texture },
                uTime: { value: 0 }
            },
            vertexShader: `
                uniform float uTime;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying float vHeight;

                void main() {
                    vUv = uv;
                    vHeight = position.y;
                    vNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);

                    vec4 worldPos = instanceMatrix * vec4(position, 1.0);

                    float heightFactor = clamp(position.y / 8.0, 0.0, 1.0);
                    float sway = sin(uTime * 0.0008 + worldPos.x * 0.15 + worldPos.z * 0.1)
                                 * heightFactor * 0.07;
                    worldPos.x += sway;

                    gl_Position = projectionMatrix * modelViewMatrix * worldPos;
                }
            `,
            fragmentShader: `
                uniform sampler2D map;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying float vHeight;

                vec3 lightDir = normalize(vec3(1.0, 1.5, 0.5));

                vec3 colorShadow = vec3(8./255.,  22./255., 10./255.);
                vec3 colorBase   = vec3(22./255., 58./255., 26./255.);
                vec3 colorLight  = vec3(58./255., 120./255., 55./255.);

                void main() {
                    vec4 texColor = texture2D(map, vUv);
                    if (texColor.r < 0.9) discard;

                    float NdotL = dot(normalize(vNormal), lightDir);

                    float light;
                    if      (NdotL > 0.35)  light = 1.0;
                    else if (NdotL > -0.15) light = 0.45;
                    else                    light = 0.0;

                    float heightT = clamp((vHeight - 1.5) / 6.5, 0.0, 1.0);
                    vec3 heightColor = mix(colorShadow, colorBase, heightT);
                    vec3 finalColor = mix(heightColor, colorLight, light * 0.6);

                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        })

        this.branchInstance = new THREE.InstancedMesh(this.branchGeometry, this.branchMaterial, this.count)

        const dummy = new THREE.Object3D()
        for (let i = 0; i < this.count; i++) {
            const { x, z, rotationY, scale } = this.instances[i]
            dummy.position.set(x, 0, z)
            dummy.rotation.set(0, rotationY, 0)
            dummy.scale.setScalar(scale)
            dummy.updateMatrix()
            this.branchInstance.setMatrixAt(i, dummy.matrix)
        }
        this.branchInstance.instanceMatrix.needsUpdate = true
        this.scene.add(this.branchInstance)
    }

    update() {
        this.branchMaterial.uniforms.uTime.value = this.time.elapsed
    }
}
