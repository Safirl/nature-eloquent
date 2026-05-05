import { Experience } from "@plugins/baseExperience";
import * as THREE from "three";

export default class AudioListenerManager {
    private declare experience: Experience;
    declare listener: THREE.AudioListener;
    declare allAudio: { audioSrc: string; audio: THREE.Audio | THREE.PositionalAudio }[];

    constructor() {
        if (!Experience.instance)
            throw new Error("AudioListenerManager: Experience is not initialized");
        this.experience = Experience.instance;
        if (!this.experience.camera?.instance)
            throw new Error("AudioListenerManager: camera.instance is not available");

        this.listener = new THREE.AudioListener();
        this.experience.camera.instance.add(this.listener);
        this.allAudio = [];
    }

    init() { }

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
        this.experience.scene.add(sound);
        this.allAudio.push({ audioSrc, audio: sound });
        return sound;
    }

    async replaceAmbiantSound(oldAudioSrc: string, newAudioSrc: string) {
        console.log("allAudio", this.allAudio)
        const found = this.allAudio.find((a) => a.audioSrc === oldAudioSrc);

        if (found) {
            const initialVolume = found.audio.getVolume();
            const fadeOutSteps = 20;

            for (let currentStep = 1; currentStep <= fadeOutSteps; currentStep++) {
                const newVolume = initialVolume * (1 - currentStep / fadeOutSteps);
                found.audio.setVolume(newVolume);
                await this.delayAfterNextAmbiantSound();
            }

            found.audio.stop();
            this.experience.scene.remove(found.audio);
            this.allAudio = this.allAudio.filter((a) => a.audioSrc !== oldAudioSrc);
        }

        this.playAmbiantSound(newAudioSrc);
    }

    delayAfterNextAmbiantSound(duration: number = 5) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }

    // Pour un son qu'on dépose dans l'espace
    playSfx(audioSrc: string, loop: boolean = false) {
        const sound = new THREE.PositionalAudio(this.listener);
        const loader = new THREE.AudioLoader();
        loader.load(audioSrc, (buffer) => {
            sound.setLoop(loop);
            sound.setRefDistance(3);
            sound.setBuffer(buffer);
            sound.setVolume(3);
            sound.play();
        });
        this.experience.scene.add(sound);
        this.allAudio.push({ audioSrc, audio: sound });
        return sound;
    }
}
