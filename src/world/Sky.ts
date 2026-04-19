import { Debug, Experience, type LifeTimeObject } from "base-experience";
import type GUI from "lil-gui";
import * as THREE from "three";
//@ts-ignore
import skyFragment from "../shaders/skybox/fragment.glsl"
//@ts-ignore
import skyVertex from "../shaders/skybox/vertex.glsl"

interface Gradient {
    timestamp: number,
    0: string,
    1: string,
    2: string,
}

export default class Sky implements LifeTimeObject{
    private skyMesh: THREE.Mesh;
    declare size: number;
    declare material: THREE.ShaderMaterial;
    declare experience: Experience
    declare scene: THREE.Scene
    declare debug: Debug
    declare debugFolder: GUI
    private gradients: Gradient[] = [
        {
            timestamp: 0,
            0: "#689599",
            1: "#C8ECC8",
            2: "#EAFBEA",
        },
        {
            timestamp: 0,
            0: "#953C2E",
            1: "#F5A72E",
            2: "#FFD18B",
        },
        {
            timestamp: 0,
            0: "#511F26",
            1: "#9A412E",
            2: "#FFD18B",
        },
        {
            timestamp: 0,
            0: "#393842",
            1: "#593E42",
            2: "#64484A",
        },
        {
            timestamp: 0,
            0: "#062023",
            1: "#21363F",
            2: "#A16D4D",
        },
    ]

    constructor(time: number, parentDebugFolder?: GUI) {
        if (!Experience.instance) throw new Error("Environment initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating the Environment.");

        this.experience = Experience.instance;
        this.scene = this.experience.scene;

        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = parentDebugFolder ? parentDebugFolder.addFolder('🌤️ Sky box') : this.debug.ui.addFolder('🌤️ Sky box')
        }

        this.setDebugObject();
        const gradient = this.getGradientForTimestamp(time)

        this.skyMesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(800, 3),
            new THREE.ShaderMaterial({
                vertexShader: skyVertex,
                fragmentShader: skyFragment,
                side: THREE.BackSide,
                uniforms: {
                    color0: {value: new THREE.Color(this.gradients[2][0])},
                    color1: {value: new THREE.Color(this.gradients[2][1])},
                    color2: {value: new THREE.Color(this.gradients[2][2])}
                }
            })
        )
        this.scene.add(this.skyMesh)
    }

    init = () => {};
    destroy = () => {};
    update = () => {};

    getGradientForTimestamp(time: number): Gradient | undefined {
        return this.gradients.find((g) => g.timestamp === time)
    }

    setDebugObject() {
        if (!this.debug.active) return;

        this.debugFolder.addColor(this.gradients[0], 0).name("skyBox gradient");
    }
}