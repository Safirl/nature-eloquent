type DialogStep = {
    audio: string;
    dialog: string;
    character: string;
    duration: number;
};

type DialogInteraction = Record<string, DialogStep>;

export default class SubtitleManager {
    declare subtitleElement: HTMLElement;
    declare dialogElement: HTMLElement;
    declare characterElement: HTMLElement;
    // declare isDialogOpen: boolean;
    declare currentIndex: number;
    declare audioPlayer: HTMLAudioElement;

    constructor() {
        this.init();
    }

    init() {
        this.subtitleElement = document.getElementById("subtitle") as HTMLElement;
        this.dialogElement = document.getElementById("dialog") as HTMLElement;
        this.characterElement = document.getElementById("character") as HTMLElement;
        this.subtitleElement.style.opacity = "0";
        // this.isDialogOpen = false;

        this.audioPlayer = new Audio();
        this.audioPlayer.preload = "auto";
    }

    playAudio(audioSrc: string) {
        if (!audioSrc) return;
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.src = audioSrc;
        this.audioPlayer.play()
    }

    // Test récupération de la durée de l'audio
    // Objectif synchroniser avec la duration du dialogue
    getDurationAudio(audioSrc: string) {
        this.audioPlayer.src = audioSrc;
        return this.audioPlayer.duration;
    }

    showSubtitle(text: string, characterName: string, audioSrc: string) {
        if (!this.subtitleElement) return;
        this.subtitleElement.style.transition = "opacity 0.5s ease-in-out";
        this.subtitleElement.style.opacity = "1";
        this.dialogElement.textContent = text;
        this.characterElement.textContent = characterName;
        this.playAudio(audioSrc);
        // this.isDialogOpen = true;
    }

    hideSubtitle() {
        if (!this.subtitleElement) return;
        this.subtitleElement.style.transition = "opacity 0.5s ease-in-out";
        this.subtitleElement.style.opacity = "0";
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        // this.isDialogOpen = false;
    }

    // Changement de dialogue automatique
    displayDialog(dialogData: DialogInteraction) {
        // if (this.isDialogOpen) return;
        const entries = Object.entries(dialogData);
        let totalDelayToClose = 0;

        entries.forEach(([_key, item]) => {
            setTimeout(() => {
                this.showSubtitle(item.dialog, item.character, item.audio);
            }, totalDelayToClose);
            totalDelayToClose += this.getDurationAudio(item.audio);
        });

        setTimeout(() => {
            this.hideSubtitle();
            // this.isDialogOpen = false;
        }, totalDelayToClose);
    }

    // Changement dialogue au clic
    displayDialogOnClick(dialogData: DialogInteraction) {
        const entries = Object.entries(dialogData);
        if (entries.length === 0) return;
        this.currentIndex = 0;
        // this.isDialogOpen = true;

        const clickNextDialogHandler = () => {
            if (this.currentIndex < entries.length) {
                const [_key, item] = entries[this.currentIndex];
                this.showSubtitle(item.dialog, item.character, item.audio);
                this.currentIndex++;
            } else {
                this.hideSubtitle();
                document.removeEventListener("click", clickNextDialogHandler);
            }
        };
        document.addEventListener("click", clickNextDialogHandler);
    }
}
