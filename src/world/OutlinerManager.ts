import { Debug, Experience, Renderer, Sizes, type LifeTimeObject } from "base-experience";
import type GUI from "lil-gui";
import type { Object3D } from "three";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import * as THREE from "three"

export default class OutlinerManager implements LifeTimeObject {
    declare experience: Experience
    declare sizes: Sizes
    declare scene: THREE.Scene
    declare debug: Debug
    declare debugFolder: GUI
    declare renderer: Renderer
    declare camera: THREE.Camera

    declare selectedObjects: Object3D[]
    declare edgeStrength: number
    declare edgeGlow: number
    declare edgeThickness: number
    declare pulsePeriod: number
    declare visibleEdgeColor: string
    declare hiddenEdgeColor: string

    declare composer: EffectComposer
    declare effectFXAA: ShaderPass
    declare outlinePass: OutlinePass

    constructor() {
        if (!Experience.instance)
            throw new Error("OutlineManager initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating the OutlineManager.")
        
        this.experience = Experience.instance;
        this.renderer = this.experience.renderer
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.debug = this.experience.debug
        this.camera = this.experience.camera.instance
        
        this.selectedObjects = []
        this.edgeStrength = 3.
        this.edgeGlow = 2.
        this.edgeThickness = 5.
        this.pulsePeriod = 0
        this.visibleEdgeColor = '#bc7edd';
        this.hiddenEdgeColor = '#000';

        this.composer = new EffectComposer( this.renderer.instance );

        const renderPass = new RenderPass( this.scene, this.camera );
        this.composer.addPass( renderPass );

        this.outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), this.scene, this.camera );
        this.composer.addPass( this.outlinePass );

        this.effectFXAA = new ShaderPass( FXAAShader );
        this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
        this.composer.addPass( this.effectFXAA );

        //Set outline properties
        this.outlinePass.edgeStrength = Number( this.edgeStrength );
        this.outlinePass.edgeGlow = Number( this.edgeGlow );
        this.outlinePass.edgeThickness = Number( this.edgeThickness );
        this.outlinePass.pulsePeriod = Number( this.pulsePeriod );
        this.outlinePass.hiddenEdgeColor.set(this.hiddenEdgeColor)
        this.outlinePass.visibleEdgeColor.set(this.visibleEdgeColor)
        
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('outline postprocessing')
            this.debugFolder.open(false)
            this.setDebugObject()
        }

        this.sizes.on("resize", this.onWindowResize)

        this.renderer.setComposer(this.composer)
    }

    init = () => {};
    update = () => {};
    destroy = () => {
        if (this.renderer)
            this.renderer.setComposer(null)
    };
    
    onWindowResize = () => {
        this.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    }
    
    addObjectOutline = (object: Object3D) => {
        // this.selectedObjects = [];
        this.selectedObjects.push(object)
        this.outlinePass.selectedObjects = this.selectedObjects;
    }

    removeObjectOutline = (object: Object3D) => {
        // this.selectedObjects = [];
        const index = this.selectedObjects.indexOf(object);
        if (index > -1) {
            this.selectedObjects.splice(index, 1);
        }
        this.outlinePass.selectedObjects = this.selectedObjects;
    }

    setDebugObject = () => {
        if(this.debug.active)
        {
            this.debugFolder
                .add(this, 'edgeStrength')
                .name('Edge strength')
                .min(.01)
                .max(10)
                .step(.01)
                .onChange(() => this.outlinePass.edgeStrength = this.edgeStrength)

            this.debugFolder
                .add(this, 'edgeGlow')
                .name('Edge glow')
                .min(.0)
                .max(1)
                .step(.02)
                .onChange(() => this.outlinePass.edgeGlow = this.edgeGlow)

            this.debugFolder
                .add(this, 'edgeThickness')
                .name('Edge thickness')
                .min(1)
                .max(4)
                .step(.1)
                .onChange(() => this.outlinePass.edgeThickness = this.edgeThickness)

            this.debugFolder
                .add(this, 'pulsePeriod')
                .name('Pulse period')
                .min(.0)
                .max(5)
                .step(.1)
                .onChange(() => this.outlinePass.pulsePeriod = this.pulsePeriod)

            this.debugFolder
                .addColor(this, 'visibleEdgeColor')
                .name('Visible edge color')
                .onChange(() => this.outlinePass.visibleEdgeColor.set(this.visibleEdgeColor))

            this.debugFolder
                .addColor(this, 'hiddenEdgeColor')
                .name('Hidden edge color')
                .onChange(() => this.outlinePass.hiddenEdgeColor.set(this.hiddenEdgeColor))
        }
    }
}