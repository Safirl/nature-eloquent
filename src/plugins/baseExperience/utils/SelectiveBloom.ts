import * as THREE from "three"
import { Experience } from "@plugins/baseExperience";
import RenderingLayers from "../../../common/RenderingLayers"
import Colors from "../../../common/Colors"

import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export default class SelectiveBloom {

    private experience: Experience;
    private darkMaterial = new THREE.MeshBasicMaterial({ color: 'black', side: THREE.DoubleSide });
    private materials: THREE.Material[] = [];
    private bloomLayer: THREE.Layers;
    private bloom_scene = 1;
    private scene: THREE.Scene;
    private bloomPass: UnrealBloomPass;
    private mixPass: ShaderPass;
    private bloomComposer: EffectComposer;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.Camera;
    private renderScene: RenderPass;
    private outputPass: OutputPass;
    private rendererExposure: number



    private params = {
        threshold: 0,
        strength: 0.7,
        radius: 0.5,
        exposure: 1,
        bloom: true
    };


    constructor(renderScene: RenderPass, bloom_scene?: number, properties?: {
        radius?: number
        strength?: number
        threshold?: number
    }) {
        if (!Experience.instance) throw new Error("SelectiveBloom initialization failed: Experience.instance is not available. Ensure Experience is initialized before creating the Renderer.");
        this.experience = Experience.instance;


        this.scene = this.experience.scene
        this.renderer = this.experience.renderer.instance
        this.camera = this.experience.camera.instance
        this.renderScene = renderScene//this.experience.renderer.renderScene;
        this.rendererExposure = this.renderer.toneMappingExposure

        bloom_scene && (this.bloom_scene = bloom_scene)

        this.bloomLayer = new THREE.Layers();
        this.bloomLayer.set(RenderingLayers.bloom);

        this.params = {
            ...this.params,
            ...properties
        }

        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        this.bloomPass.threshold = this.params.threshold;
        this.bloomPass.strength = this.params.strength;
        this.bloomPass.radius = this.params.radius;


        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.renderToScreen = false;



        this.bloomComposer.addPass(this.renderScene);
        this.bloomComposer.addPass(this.bloomPass);

        this.mixPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: this.bloomComposer.renderTarget2.texture },
                    bloomStrength: { value: this.params.strength }

                },
                vertexShader: `
                varying vec2 vUv;

                void main() {

                    vUv = uv;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

                }
            `,
                fragmentShader: `
   			uniform sampler2D baseTexture;
			uniform sampler2D bloomTexture;
			uniform float bloomStrength;

			varying vec2 vUv;

			void main() {

				gl_FragColor = ( texture2D( baseTexture, vUv ) + texture2D( bloomTexture, vUv ) * bloomStrength );

			}
            `,
                defines: {}
            }), 'baseTexture'
        );

        this.outputPass = new OutputPass();
        this.mixPass.needsSwap = true;
        this.setDebugObject()
    }

    setRenderScene(renderScene: RenderPass) {
        this.renderScene = renderScene
    }

    get getBloomPass() {
        return this.bloomPass
    }

    get getMixPass() {
        return this.mixPass
    }
    get getBloomComposer() {
        return this.bloomComposer
    }
    get getRenderScene() {
        return this.bloomComposer
    }
    get getOutputPass() {
        return this.outputPass
    }


    setDebugObject() {

        if (!this.experience.debug.active) return

        const folder = this.experience.debug.ui.addFolder(`🌄 Bloom layer ${this.bloom_scene}`);

        folder.add(this.params, 'threshold', 0.0, 10.0).onChange((value: number) => {
            this.bloomPass.threshold = Number(value);
        });

        folder.add(this.params, 'strength', 0.0, 30.0).onChange((value: number) => {
            this.bloomPass.strength = Number(value);
        });

        folder.add(this.params, 'radius', 0.0, 10.0).step(0.01).onChange((value: number) => {
            this.bloomPass.radius = Number(value);
        });

        folder.add(this.params, 'bloom').onChange((value: boolean) => {
            this.bloomPass.enabled = value
        });


    }

    darkenNonBloomed = (obj: any) => {

        if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
            if (obj.material && obj.material.uniforms && obj.material.uniforms.uDarkFactor) {
                obj.material.uniforms.uDarkFactor.value = new THREE.Color(0x000000);
                //@ts-ignore
                this.materials[obj.uuid] = true;
            } else {
                this.materials[obj.uuid] = obj.material;
                obj.material = this.darkMaterial;
            }
        }
    }

    restoreMaterial = (obj: any) => {
        if (this.materials[obj.uuid]) {
            if (obj.material && obj.material.uniforms && obj.material.uniforms.uDarkFactor) {
                obj.material.uniforms.uDarkFactor.value = new THREE.Color(0xffffff);
            } else {
                obj.material = this.materials[obj.uuid];
            }
            delete this.materials[obj.uuid];
        }
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.bloomComposer && this.bloomComposer.setSize(width, height);
    }

    update() {
        this.scene.traverse(this.darkenNonBloomed);
        this.bloomComposer.render();
        this.scene.traverse(this.restoreMaterial);
    }
}