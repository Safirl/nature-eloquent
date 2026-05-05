import { Experience } from "@plugins/baseExperience";
import * as THREE from "three";

export default class AudioListenerManager {
    private declare experience: Experience;
    declare listener: THREE.AudioListener;

    constructor() {
        if (!Experience.instance) throw new Error("AudioListenerManager: Experience is not initialized");
        this.experience = Experience.instance;
        if (!this.experience.camera?.instance) throw new Error("AudioListenerManager: camera.instance is not available");

        this.listener = new THREE.AudioListener();
        this.experience.camera.instance.add(this.listener);
    }

    init() {

    }

    playAmbiantSound(audioSrc: string) {
        const sound = new THREE.PositionalAudio(this.listener);
        const loader = new THREE.AudioLoader();
        loader.load(audioSrc, (buffer) => {
            sound.setBuffer(buffer);
            sound.setVolume(3);
            sound.setLoop(true);
            sound.play();
        });
    }
}