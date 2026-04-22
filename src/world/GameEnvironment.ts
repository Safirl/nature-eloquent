import { Environment, Experience } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three"
import Sky from "./Sky";
import Cloud from "./Cloud";
import { UnrealBloomPass } from "three/examples/jsm/Addons.js";

export default class GameEnvironment extends Environment {
    protected declare bloomDebugFolder: GUI
    declare fogDebugFolder: GUI
    declare camera: THREE.Camera
    declare sunlightOffset: THREE.Vector3
    declare sky: Sky
    declare fog: THREE.Fog
    declare bloomPass: UnrealBloomPass
    declare cloud: Cloud;
    private declare sunMesh: THREE.Mesh;

    constructor(lightingEnvironmentMap?: THREE.CubeTexture<unknown> | undefined, useAsBackground?: boolean, backgroundEnvironmentMap?: THREE.CubeTexture) {
        super(lightingEnvironmentMap, useAsBackground, backgroundEnvironmentMap)
        // this.sky = new Sky(0, this.debugFolder)
        this.setFog();
        this.setBloom()
        // this.cloud = new Cloud()
        // const bg = this.createBackground();
        // const sky = new THREE.Mesh(
        //     new THREE.SphereGeometry( 800 ),
        //     new THREE.MeshBasicMaterial( { map: bg, side: THREE.BackSide } )
        // );
        // this.scene.add( sky );
    }

    setFog() {
        this.fog = new THREE.Fog("#ecdfc8", 0, 120);
        this.scene.fog = this.fog;
        /**
         * Add debugger
         */
        if (this.debugFolder) {
            this.fogDebugFolder = this.debugFolder.addFolder("🌫️ fog")
            this.fogDebugFolder
                .add(this.fog, "near")
                .name('fog near')
                .min(0)
                .max(100)
                .step(0.1)

            this.fogDebugFolder
                .add(this.fog, "far")
                .name('fog far')
                .min(0)
                .max(1000)
                .step(0.1)
        }
    }

    setSunlight(): void {
        const player = Experience.instance?.camera.instance
        if (!player) return;
        this.camera = player

        this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 25;
        this.sunLight.shadow.mapSize.set(2048 * 2, 2048 * 2);
        this.sunLight.shadow.radius = 2.5
        this.sunLight.shadow.normalBias = 0.05;
        this.sunlightOffset = new THREE.Vector3(-45, 8.2, 22.95)
        this.sunLight.position.set(this.sunlightOffset.x, this.sunlightOffset.y, this.sunlightOffset.z);
        this.scene.add(this.sunLight);

        this.sunLight.shadow.camera.near = 1
        this.sunLight.shadow.camera.far = 100
        this.sunLight.shadow.camera.top = 45
        this.sunLight.shadow.camera.right = 45
        this.sunLight.shadow.camera.left = -45
        this.sunLight.shadow.camera.bottom = -45

        this.setSunPlane();

        /**
         * Add debugger
         */
        // this.sunLight.target =  this.camera
    }

    setDebugObject(): void {
        super.setDebugObject()
        if (this.debug.active) {
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
    }

    updateCameraShadowAmplitude(value: number) {
        this.sunLight.shadow.camera.top = value
        this.sunLight.shadow.camera.right = value
        this.sunLight.shadow.camera.left = -value
        this.sunLight.shadow.camera.bottom = -value
        this.updateShadowMatrix()
    }

    setSunPlane() {
        this.sunMesh = new THREE.Mesh(new THREE.CircleGeometry(), new THREE.MeshBasicMaterial())
        this.sunMesh.position.set(this.sunLight.position.x, this.sunLight.position.y, this.sunLight.position.z)
        this.sunMesh.lookAt(new THREE.Vector3())
        // const sunLightWorldDirection
        // this.sunMesh.rotation.set(this.sunLight.getWorldDirection()) this.sunLight.rotation.y, this.sunLight.rotation.z)
        this.sunLight.attach(this.sunMesh)
    }

    setBloom() {
        const resolution = Experience.instance?.sizes
        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(resolution?.width, resolution?.height), .4, 0.4, 0.85);
        Experience.instance?.renderer.addComposerPass(this.bloomPass, false);

        /**
         * Add debugger
         */
        if (this.debugFolder) {
            this.bloomDebugFolder = this.debugFolder.addFolder("🌄 Bloom")
            this.bloomDebugFolder
                .add(this.bloomPass, "enabled")
                .name('Enabled')
            this.bloomDebugFolder
                .add(this.bloomPass, "strength")
                .name('Strength')
                .min(.1)
                .max(5)
                .step(.1)
            this.bloomDebugFolder
                .add(this.bloomPass, "radius")
                .name('Radius')
                .min(.1)
                .max(5)
                .step(.1)
            this.bloomDebugFolder
                .add(this.bloomPass, "threshold")
                .name('Threshold')
                .min(.1)
                .max(1)
                .step(.001)
        }
    }

    // update() {
    //     this.sunLight.position.set(this.camera.position.x + this.sunlightOffset.x, this.camera.position.y + this.sunlightOffset.y, this.camera.position.z + this.sunlightOffset.z)
    // }

    // getSunlightPosition() {
    //     const cameraPosition = this.camera.position.add(this.sunlightOffset)
    //     return cameraPosition
    // }
} 