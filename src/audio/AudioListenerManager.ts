import { Experience } from "@plugins/baseExperience";
import * as THREE from "three";

export default class AudioListenerManager {
    private declare experience: Experience;
    declare listener: THREE.AudioListener;
    declare allAudio: { audioSrc: string; audio: THREE.Audio | THREE.PositionalAudio }[];
    // All object element in nature to put positionnal fixe on scene
    declare soundElementNature: { name: string; src: string; volume: number; position: THREE.Vector3 }[]

    constructor() {
        if (!Experience.instance)
            throw new Error("AudioListenerManager: Experience is not initialized");
        this.experience = Experience.instance;
        if (!this.experience.camera?.instance)
            throw new Error("AudioListenerManager: camera.instance is not available");

        this.listener = new THREE.AudioListener();
        this.experience.camera.instance.add(this.listener);
        this.allAudio = [];

        // Si on veut ajouter des sons disposés dans la scène 3D
        this.soundElementNature = [{
            name: "bee",
            src: "/audio/soundEffects/bee.mp3",
            volume: 0.5,
            position: new THREE.Vector3(0, 0, 0)
        }];

        this.init();
    }

    init() {
    }

    // Pour un son qu'on dépose dans l'espace
    playSfx(audioSrc: string, loop: boolean = false, volume: number = 1) {
        const sound = new THREE.PositionalAudio(this.listener);
        const loader = new THREE.AudioLoader();
        loader.load(audioSrc, (buffer) => {
            sound.setLoop(loop);
            sound.setRefDistance(2);
            sound.setBuffer(buffer);
            sound.setVolume(volume);
            sound.play();
        });
        this.experience.scene.add(sound);
        this.allAudio.push({ audioSrc, audio: sound });
        return sound;
    }

    // Si on veut un son aléatoire parmi une liste
    playRandomSrc(audioSrcArray: { src: string, volume?: number }[]) {
        const randomIndex = Math.floor(Math.random() * audioSrcArray.length);
        const { src, volume } = audioSrcArray[randomIndex];
        return { src, volume };
    }

    // Pour stoper un sound effect
    stopSfx(audioSrc: string) {
        const found = this.allAudio.find((a) => a.audioSrc === audioSrc);

        if (found) {
            found.audio.stop();
            this.experience.scene.remove(found.audio);
            this.allAudio = this.allAudio.filter((a) => a.audioSrc !== audioSrc);
        }
    }

    async easingAudio(audio: THREE.Audio | THREE.PositionalAudio, duration: number = 2000, fadeIn: boolean = false) {
        const initialVolume = fadeIn ? 0 : audio.getVolume();
        const fadeOutSteps = 20;

        for (let i = 0; i <= fadeOutSteps; i++) {
            const newVolume = fadeIn
                ? (i / fadeOutSteps) * initialVolume
                : initialVolume * (1 - i / fadeOutSteps);
            audio.setVolume(newVolume);
            await new Promise((resolve) => setTimeout(resolve, duration / fadeOutSteps));
        }
    }

    playAllSounDElementNature() {
        this.soundElementNature.forEach((item) => {
            this.playSfx(item.src, true, item.volume);
            // Ajouter le son dans la scène à la position définie
            const sound = this.allAudio[this.allAudio.length - 1].audio as THREE.PositionalAudio;
            sound.position.copy(item.position);
        });
    }

}