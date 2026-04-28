import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three"
//@ts-ignore
import grassFragment from "@shaders/grass/fragment.glsl"
//@ts-ignore
import grassVertex from "@shaders/grass/vertex.glsl"

export default class Grass implements LifeTimeObject {
    private declare experience: Experience;
    private declare debugFolder: GUI;
    private declare gridDebugger: THREE.GridHelper;
    private declare material: THREE.ShaderMaterial;
    private declare geometry: THREE.InstancedBufferGeometry;
    private declare mesh: THREE.Mesh;
    private grassFieldSizes = { x: 50, y: 50 };
    public windStrength = .54;
    public windFrequency = .0006;
    public windScale = .18;

    constructor() {
        if (!Experience.instance) return;

        this.experience = Experience.instance

        if (this.experience?.debug.active) {
            this.debugFolder = this.experience?.debug.ui.addFolder("🌿 Grass")
        }
        this.setDebugObject()

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        const count = 50000;
        const positions = new Float32Array([
            .5, -.5, 0,
            -.5, -.5, 0,
            -.5, .5, 0,
            .5, .5, 0,
        ])
        const indexs = [
            0,
            1,
            2,
            2,
            3,
            0,
        ]
        const uvs = [
            1.0, 0.0,
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
        ]
        const globalPositions = new Float32Array(3 * count);
        // const angles = new Float32Array(count);


        const fieldWidth = this.grassFieldSizes.x;
        const fieldDepth = this.grassFieldSizes.y;
        const fieldHeight = 0;

        for (let i = 0; i < count; i++) {
            // const element = array[i];
            const i3 = i * 3;

            const posX = Math.random() * fieldWidth - fieldWidth * .5
            const posY = fieldHeight;
            const posZ = Math.random() * fieldDepth - fieldDepth * .5
            globalPositions[i3] = posX;
            globalPositions[i3 + 1] = posY;
            globalPositions[i3 + 2] = posZ;

            // angles[i] = 45;
        }

        this.geometry = new THREE.InstancedBufferGeometry();
        this.geometry.instanceCount = count
        this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
        this.geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
        this.geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indexs), 1))
        this.geometry.setAttribute("aGlobalPosition", new THREE.InstancedBufferAttribute(globalPositions, 3))
        // this.geometry.setAttribute("aAngle", new THREE.InstancedBufferAttribute(angles, 1))
    }

    setMaterial() {
        const grassMap = this.experience.resources.items["grassColorTexture"]
        const grassAlphaMap = this.experience.resources.items["grassAlphaTexture"]
        const cameraDirection = new THREE.Vector3();
        this.experience.camera.instance.getWorldDirection(cameraDirection);
        this.material = new THREE.ShaderMaterial({
            fragmentShader: grassFragment,
            vertexShader: grassVertex,
            side: THREE.BackSide,
            uniforms: {
                uGrassMapTexture: { value: grassMap as THREE.Texture },
                uGrassAlphaMap: { value: grassAlphaMap as THREE.Texture },
                uCameraPosition: { value: this.experience.camera.instance.position },
                uTime: { value: 0 },
                uWindStrength: { value: this.windStrength },
                uWindFrequency: { value: this.windFrequency },
                uWindScale: { value: this.windScale },
            },
            transparent: true,
            // depthTest: false,
            // depthWrite: false
        })
    }

    setMesh() {
        // const planeGeo = new THREE.PlaneGeometry(1, 1)
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this.experience.scene.add(this.mesh)
    }

    init = () => { };
    destroy = () => { };
    update = () => {
        this.material.uniforms.uCameraPosition.value = this.experience.camera.instance.position
        this.material.uniforms.uTime.value = Experience.instance?.time.elapsed
    };

    setDebugObject = () => {
        if (!this.experience?.debug.active) return;

        this.gridDebugger = new THREE.GridHelper(this.grassFieldSizes.x, this.grassFieldSizes.y)
        this.gridDebugger.layers.set(2)
        this.experience.scene.add(this.gridDebugger)

        this.debugFolder.add(this, "windStrength").min(.01).max(1).step(.001).onChange(() => {
            this.material.uniforms.uWindStrength.value = this.windStrength;
        });
        this.debugFolder.add(this, "windFrequency").min(.0001).max(0.01).step(.0001).onChange(() => {
            this.material.uniforms.uWindFrequency.value = this.windFrequency;
        });
        this.debugFolder.add(this, "windScale").min(.01).max(2).step(.01).onChange(() => {
            this.material.uniforms.uWindScale.value = this.windScale;
        });
    }
}