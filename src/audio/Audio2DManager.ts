import { EventEmitter, Experience } from "@plugins/baseExperience";

export default class AudioManager extends EventEmitter {
    public audios: { audio: HTMLAudioElement, src: string, volume: number }[] = []
    declare experience: Experience;
    declare currentAmbient: any;
    constructor() {
        super();
        if (!Experience.instance) throw new Error("AudioManager: Experience is not initialized");
        this.experience = Experience.instance;
        this.init()
        this.currentAmbient = null;
    }

    init() { }

    playAmbient(audioSrc: string, volume: number = 1) {
        if (this.currentAmbient) {
            this.easingAudio(this.currentAmbient).then(() => {
                this.currentAmbient.pause();
                this.audios = this.audios.filter((a) => a.audio !== this.currentAmbient);
                this.currentAmbient = this.playAudio(audioSrc, true, volume) ?? null;
            });
        } else {
            this.currentAmbient = this.playAudio(audioSrc, true, volume) ?? null;
        }
    }

    playAudio(audioSrc: string, loop: boolean = false, volume: number = 1, startDelay: number = 0) {
        if (!audioSrc) return;

        const audio = new Audio(audioSrc);
        audio.preload = "auto";
        audio.loop = loop;
        audio.volume = volume;

        this.audios.push({ audio, src: audioSrc, volume });
        this.setupDebug({ audio, src: audioSrc, volume });

        // Si on veut ajouter un délai avant de jouer le son
        setTimeout(() => {
            audio.play();
        }, startDelay);

        audio.addEventListener("ended", () => {
            this.audios = this.audios.filter((a) => a.audio !== audio);
        });
        return audio;
    }

    stopAudio(audioSrc: string) {
        const audio = this.audios.find((aud) => aud.src === audioSrc);
        if (audio) {
            audio.audio.pause();
            audio.audio.currentTime = 0;
            this.audios = this.audios.filter((a) => a !== audio);
        }
    }

    async playFootStepAudio(audioSrc: string, volume: number = 1) {
        await new Promise((resolve) => {
            const audio = new Audio(audioSrc);
            audio.preload = "auto";
            audio.playbackRate = 1;
            audio.volume = volume;

            audio.play();
            audio.addEventListener("ended", () => {
                resolve(undefined);
            });
        });
    }

    async easingAudio(audio: HTMLAudioElement, fadeIn: boolean = false, duration: number = 2000) {
        const initialVolume = fadeIn ? 0 : audio.volume;
        const fadeOutSteps = 20;

        for (let i = 0; i <= fadeOutSteps; i++) {
            const newVolume = fadeIn
                ? (i / fadeOutSteps) * initialVolume
                : initialVolume * (1 - i / fadeOutSteps);
            audio.volume = newVolume;
            await this.delayAfterNextAudio(duration / fadeOutSteps);
        }
    }

    delayAfterNextAudio(duration: number = 100) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }

    setupDebug(entry: { audio: HTMLAudioElement, src: string, volume: number }) {
        if (!this.experience.debug.active) return;
        if (!this.experience.debug.ui) return;

        const folder = this.experience.debug.ui.addFolder(entry.src);
        folder.add(entry, "volume", 0, 1, 0.01)
            .name("volume")
            .onChange((v: number) => {
                entry.audio.volume = v;
            });
    }


    // --- Aujourd'hui fonction pas encore utilisée

    // loopAudio(audioSrc: string) {
    //     return this.playAudio(audioSrc, true);
    // }

    // replaceAudio(oldAudioSrc: string, newAudioSrc: string, loop: boolean = false) {
    //     this.stopAudio(oldAudioSrc);
    //     return this.playAudio(newAudioSrc, loop);
    // }

    // stopLoopAudio(audioSrc: string) {
    //     this.stopAudio(audioSrc);
    // }
}