import { EventEmitter } from "@plugins/baseExperience";

export default class AudioManager extends EventEmitter {
    public audios: { audio: HTMLAudioElement, src: string }[] = []

    constructor() {
        super();
        this.init()
    }

    init() { }

    playAudio(audioSrc: string, loop: boolean = false, volume: number = 1) {
        if (!audioSrc) return;

        const audio = new Audio(audioSrc);
        audio.preload = "auto";
        audio.loop = loop;
        audio.volume = volume;

        this.audios.push({ audio, src: audioSrc });
        audio.play();

        audio.addEventListener("ended", () => {
            this.audios = this.audios.filter((a) => a.audio !== audio);
        });
        return audio;
    }

    async playFootStepAudio(audioSrc: string) {
        await new Promise((resolve) => {
            const audio = new Audio(audioSrc);
            audio.preload = "auto";
            audio.play();
            audio.addEventListener("ended", () => {
                resolve(undefined);
            });
        });
    }

    async fadeOutAudio(audio: HTMLAudioElement, duration: number = 1000) {
        const initialVolume = audio.volume;
        const fadeOutSteps = 20;

        for (let currentStep = 1; currentStep <= fadeOutSteps; currentStep++) {
            const newVolume = initialVolume * (1 - currentStep / fadeOutSteps);
            audio.volume = newVolume;
            await this.delayAfterNextAudio(duration / fadeOutSteps);
        }
    }

    delayAfterNextAudio(duration: number = 100) {
        return new Promise((resolve) => setTimeout(resolve, duration));
    }


    // --- Aujourd'hui fonction pas encore utilisée

    // loopAudio(audioSrc: string) {
    //     return this.playAudio(audioSrc, true);
    // }

    // replaceAudio(oldAudioSrc: string, newAudioSrc: string, loop: boolean = false) {
    //     this.stopAudio(oldAudioSrc);
    //     return this.playAudio(newAudioSrc, loop);
    // }

    // stopAudio(audioSrc: string) {
    //     const audio = this.audios.find((aud) => aud.src === audioSrc);

    //     if (audio) {
    //         audio.audio.pause();
    //         audio.audio.currentTime = 0;
    //         this.audios = this.audios.filter((a) => a !== audio);
    //     }
    // }

    // stopLoopAudio(audioSrc: string) {
    //     this.stopAudio(audioSrc);
    // }
}