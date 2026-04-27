import SubtitleManager from "./SubtitleManager";

export default class DialogAudioManager {

    declare audioElement: HTMLAudioElement;
    declare subtitle: SubtitleManager;

    constructor() {
        this.init();
    }

    init() {
        this.audioElement = document.getElementById("dialog-audio") as HTMLAudioElement;
        this.subtitle = new SubtitleManager();
    }

}