import { Environment, Experience } from "base-experience";
import type GUI from "lil-gui";
import * as THREE from "three"
import Sky from "./Sky";

export default class GameEnvironment extends Environment {
    declare shadowHelper: THREE.CameraHelper
    declare sunlightDebugFolder: GUI
    declare camera: THREE.Camera
    declare sunlightOffset: THREE.Vector3
    declare sky: Sky

    constructor(lightingEnvironmentMap?: THREE.CubeTexture<unknown> | undefined, useAsBackground?: boolean, backgroundEnvironmentMap?: THREE.CubeTexture) {
        super(lightingEnvironmentMap, useAsBackground, backgroundEnvironmentMap)
        this.sky = new Sky(0, this.debugFolder)
        // const bg = this.createBackground();
        // const sky = new THREE.Mesh(
        //     new THREE.SphereGeometry( 800 ),
        //     new THREE.MeshBasicMaterial( { map: bg, side: THREE.BackSide } )
        // );
        // this.scene.add( sky );
    }

    createBackground(): THREE.CanvasTexture | undefined {
        const canvas = document.createElement( 'canvas' );
        canvas.width = 1;
        canvas.height = 32;

        const context = canvas.getContext( '2d' );
        if (!context) return undefined;
        const gradient = context.createLinearGradient( 0, 0, 0, 32 );
        // gradient.addColorStop( 0.0, '#014a84' );
        // gradient.addColorStop( 0.5, '#0561a0' );
        // gradient.addColorStop( 1.0, '#437ab6' );
        gradient.addColorStop( 0.0, '#508401' );
        gradient.addColorStop( 0.5, '#a0057e' );
        gradient.addColorStop( 1.0, '#437ab6' );
        context.fillStyle = gradient;
        context.fillRect( 0, 0, 1, 32 );

        const skyMap = new THREE.CanvasTexture( canvas );
        skyMap.colorSpace = THREE.SRGBColorSpace;
        return skyMap;
    }

    setSunlight(): void {
        const player = Experience.instance?.camera.instance
        if (!player) return;
        this.camera = player

        this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 25;
        this.sunLight.shadow.mapSize.set(2048, 2048);
        this.sunLight.shadow.radius = 2.5
        this.sunLight.shadow.normalBias = 0.05;
        this.sunlightOffset = new THREE.Vector3(-4.5*10, .82*10, 2.295*10)
        this.sunLight.position.set(this.getSunlightPosition().x, this.getSunlightPosition().y, this.getSunlightPosition().z);
        this.scene.add(this.sunLight);

        this.sunLight.shadow.camera.near = 1
        this.sunLight.shadow.camera.far = 100
        this.sunLight.shadow.camera.top = 65.0
        this.sunLight.shadow.camera.right = 65.0
        this.sunLight.shadow.camera.left = -65.0
        this.sunLight.shadow.camera.bottom = -65.0

        /**
         * Add debugger
         */
        if (this.debugFolder) {
            this.sunlightDebugFolder = this.debugFolder.addFolder("sunlight")
            this.shadowHelper = new THREE.CameraHelper(this.sunLight.shadow.camera)
            this.scene.add(this.shadowHelper)
        }
        this.sunLight.target =  this.camera
    }

    setDebugObject(): void {
        super.setDebugObject()
        if(this.debug.active)
        {
            this.sunlightDebugFolder
                .add(this.sunLight.shadow.camera, 'near')
                .name('sunlight shadow near')
                .min(1)
                .max(19)
                .step(0.1)
                .onChange(() => this.updateShadowMatrix())

            this.sunlightDebugFolder
                .add(this.sunLight.shadow.camera, 'far')
                .name('sunlight shadow far')
                .min(1)
                .max(50)
                .step(0.1)
                .onChange(() => this.updateShadowMatrix())

            this.sunlightDebugFolder
                .add(this.sunLight.shadow.camera, 'top')
                .name('shadow amplitude')
                .min(1)
                .max(200)
                .step(.1)
                .onChange((v: number) => this.updateCameraShadowAmplitude(v))

            this.sunlightDebugFolder
                .add(this.sunLight.shadow, 'radius')
                .name('sunlight shadow radius')
                .min(1)
                .max(20)
                .step(0.1)
                .onChange(() => this.updateShadowMatrix())
        }

    }
    
    updateShadowMatrix = () => {
        this.sunLight.shadow.camera.updateProjectionMatrix()
        this.shadowHelper.update()
    }

    updateCameraShadowAmplitude(value: number) {
        this.sunLight.shadow.camera.top = value
        this.sunLight.shadow.camera.right = value
        this.sunLight.shadow.camera.left = -value
        this.sunLight.shadow.camera.bottom = -value
        this.updateShadowMatrix()
    }

    update() {
        this.sunLight.position.set(this.camera.position.x + this.sunlightOffset.x, this.camera.position.y + this.sunlightOffset.y, this.camera.position.z + this.sunlightOffset.z)
    }

    getSunlightPosition() {
        const cameraPosition = this.camera.position.add(this.sunlightOffset)
        return cameraPosition
    }
} 