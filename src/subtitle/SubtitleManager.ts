type DialogStep = {
    dialog: string;
    step: number;
};

type DialogInteraction = Record<string, DialogStep>;

export default class SubtitleManager {
    declare subtitleElement: HTMLElement;
    declare dialogElement: HTMLElement;
    declare isDialogOpen: boolean;
    declare currentIndex: number;

    constructor() {
        this.init();
    }

    init() {
        this.subtitleElement = document.getElementById("subtitle") as HTMLElement;
        this.dialogElement = document.getElementById("dialog") as HTMLElement;
        this.subtitleElement.style.opacity = "0";
        this.isDialogOpen = false;
        this.currentIndex = 0;
    }

    showSubtitle(text: string) {
        if (!this.subtitleElement) return;
        this.subtitleElement.style.transition = "opacity 0.5s ease-in-out";
        this.subtitleElement.style.opacity = "1";
        this.dialogElement.textContent = text;
        this.isDialogOpen = true;
    }

    hideSubtitle() {
        if (!this.subtitleElement) return;
        this.subtitleElement.style.transition = "opacity 0.5s ease-in-out";
        this.subtitleElement.style.opacity = "0";
        this.isDialogOpen = false;
    }

    displayDialog(dialogData: DialogInteraction) {
        if (this.isDialogOpen) return;
        const entries = Object.entries(dialogData);
        let totalDelayToClose = 0;

        entries.forEach(([_, item]) => {
            setTimeout(() => {
                this.showSubtitle(item.dialog);
            }, totalDelayToClose);
            totalDelayToClose += item.step;
        });

        setTimeout(() => {
            this.hideSubtitle();
            this.isDialogOpen = false;
        }, totalDelayToClose);
    }

    displayDialogOnClick(dialogData: DialogInteraction) {
        const entries = Object.entries(dialogData);
        if (entries.length === 0 || this.isDialogOpen) return;
        this.currentIndex = 0;
        this.isDialogOpen = true;

        const clickNextDialogHandler = () => {
            if (this.currentIndex < entries.length) {
                const [_, item] = entries[this.currentIndex];
                this.showSubtitle(item.dialog);
                this.currentIndex++;
                console.log("current index: ", this.currentIndex);
            } else {
                this.hideSubtitle();
                this.isDialogOpen = false;
                this.currentIndex = 0;
            }
        };
        document.addEventListener("click", clickNextDialogHandler);
    }

}