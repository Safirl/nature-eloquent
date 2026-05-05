import { EventEmitter } from "@plugins/baseExperience";

export default class AudioManager extends EventEmitter {
    public audios: { audio: HTMLAudioElement, src: string }[] = []

    constructor() {
        super();
        this.init()
    }

    init() { }

    playAudio(audioSrc: string, loop: boolean = false) {
        if (!audioSrc) return;

        const audio = new Audio(audioSrc);
        audio.preload = "auto";
        audio.loop = loop;

        this.audios.push({ audio, src: audioSrc });

        audio.play();

        audio.addEventListener("ended", () => {
            this.audios = this.audios.filter((a) => a.audio !== audio);
        });
        console.log("tous les audios actifs", this.audios)

        return audio;
    }

    loopAudio(audioSrc: string) {
        return this.playAudio(audioSrc, true);
    }

    replaceAudio(oldAudioSrc: string, newAudioSrc: string, loop: boolean = false) {
        this.stopAudio(oldAudioSrc);
        return this.playAudio(newAudioSrc, loop);
    }

    stopAudio(audioSrc: string) {
        const audio = this.audios.find((aud) => aud.src === audioSrc);

        if (audio) {
            audio.audio.pause();
            audio.audio.currentTime = 0;
            this.audios = this.audios.filter((a) => a !== audio);
        }
    }

    stopLoopAudio(audioSrc: string) {
        this.stopAudio(audioSrc);
    }



}