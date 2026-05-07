import { Experience } from "@plugins/baseExperience";
import * as THREE from "three";

export default class AudioListenerManager {
    private declare experience: Experience;
    declare listener: THREE.AudioListener;
    declare allAudio: { audioSrc: string; audio: THREE.Audio | THREE.PositionalAudio }[];
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
            src: "/audio/welcome.mp3",
            volume: 0.5,
            position: new THREE.Vector3(0, 0, 0)
        }];

        this.init();
    }

    init() {
        this.playAllSoundElementNature();
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

    async easingAudio(audio: THREE.Audio | THREE.PositionalAudio, duration: number = 2000, fadeIn: boolean = false, targetVolume: number = 1) {
        const steps = 20;

        if (fadeIn) {
            audio.setVolume(0);
            for (let i = 0; i <= steps; i++) {
                audio.setVolume((i / steps) * targetVolume);
                await new Promise((resolve) => setTimeout(resolve, duration / steps));
            }
        } else {
            const initialVolume = audio.getVolume();
            for (let i = 0; i <= steps; i++) {
                audio.setVolume(initialVolume * (1 - i / steps));
                await new Promise((resolve) => setTimeout(resolve, duration / steps));
            }
        }
    }

    // Ajouter des éléments sonores fixes dans la scène
    playAllSoundElementNature() {
        this.soundElementNature.forEach((item) => {
            const sound = this.playSfx(item.src, true, item.volume);
            sound.position.copy(item.position);
        });
    }

}