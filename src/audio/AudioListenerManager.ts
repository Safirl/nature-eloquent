import { Experience } from "@plugins/baseExperience";
import * as THREE from "three";

export default class AudioListenerManager {
    private declare experience: Experience;
    declare listener: THREE.AudioListener;
    declare allAudio: THREE.PositionalAudio[]

    constructor() {
        if (!Experience.instance) throw new Error("AudioListenerManager: Experience is not initialized");
        this.experience = Experience.instance;
        if (!this.experience.camera?.instance) throw new Error("AudioListenerManager: camera.instance is not available");

        this.listener = new THREE.AudioListener();
        this.experience.camera.instance.add(this.listener);
        this.allAudio = [];
    }

    init() {

    }

    // Pour le son globale d'ambiance
    playAmbiantSound(audioSrc: string) {
        const sound = new THREE.Audio(this.listener);
        const loader = new THREE.AudioLoader();
        loader.load(audioSrc, (buffer) => {
            sound.setBuffer(buffer);
            sound.setVolume(1);
            sound.setLoop(true);
            sound.play();
        });
    }

    playSfx(audioSrc: string, loop: boolean = true) {
        // Ajouter une position au son pour le spatialiser
        const position = new THREE.Vector3();


        const sound = new THREE.PositionalAudio(this.listener);
        console.log("sound ", sound)
        const loader = new THREE.AudioLoader();
        loader.load(audioSrc, (buffer) => {
            console.log("buffer", buffer)
            sound.setLoop(loop)
            sound.setRefDistance(5);
            sound.setBuffer(buffer);
            sound.setVolume(5);
            sound.play();
        });
        return sound;
    }
}