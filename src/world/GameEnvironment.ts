import { Environment, Experience } from "base-experience";
import type GUI from "lil-gui";
import * as THREE from "three"

export default class GameEnvironment extends Environment {
    declare shadowHelper: THREE.CameraHelper
    declare sunlightDebugFolder: GUI

    setSunlight(): void {
        this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 25;
        this.sunLight.shadow.mapSize.set(2048, 2048);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3, 3, 2);
        this.scene.add(this.sunLight);

        this.sunLight.shadow.camera.near = 1
        this.sunLight.shadow.camera.far = 25
        this.sunLight.position.set(-4.5, .82, 2.295)

        /**
         * Add debugger
         */
        if (this.debugFolder) {
            this.sunlightDebugFolder = this.debugFolder.addFolder("sunlight")
            this.shadowHelper = new THREE.CameraHelper(this.sunLight.shadow.camera)
            this.scene.add(this.shadowHelper)
        }
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
                .name('sunlight shadow top')
                .min(1)
                .max(300)
                .step(1)
                .onChange(() => this.updateShadowMatrix())

            this.sunlightDebugFolder
                .add(this.sunLight.shadow.camera, 'left')
                .name('sunlight shadow left')
                .min(-300)
                .max(-1)
                .step(1)
                .onChange(() => this.updateShadowMatrix())

            this.sunlightDebugFolder
                .add(this.sunLight.shadow.camera, 'right')
                .name('sunlight shadow right')
                .min(1)
                .max(300)
                .step(1)
                .onChange(() => this.updateShadowMatrix())
            
            this.sunlightDebugFolder
                .add(this.sunLight.shadow.camera, 'bottom')
                .name('sunlight shadow bottom')
                .min(-300)
                .max(-1)
                .step(1)
                .onChange(() => this.updateShadowMatrix())

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
        console.log("coucou")
        this.sunLight.shadow.camera.updateProjectionMatrix()
        this.shadowHelper.update()
    }

    update() {
        let cameraPosition = new THREE.Vector3();
        const position = Experience.instance?.camera.instance.position;
        if (!position) return;

        cameraPosition.copy(position)
        cameraPosition.y += 3
        this.sunLight.shadow.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)
    }
} 