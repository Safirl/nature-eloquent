type DialogStep = {
    dialog: string;
    step: number;
};

type DialogInteraction = Record<string, DialogStep>;

export default class SubtitleManager {
    declare subtitleElement: HTMLElement;
    declare dialogElement: HTMLElement;
    declare isDialogOpen: boolean;

    constructor() {
        this.init();
    }

    init() {
        this.subtitleElement = document.getElementById("subtitle") as HTMLElement;
        this.dialogElement = document.getElementById("dialog") as HTMLElement;
        this.subtitleElement.style.opacity = "0";
        this.isDialogOpen = false;
    }

    showSubtitle(text: string) {
        if (!this.subtitleElement) return;
        this.subtitleElement.style.transition = "opacity 0.5s ease-in-out";
        this.subtitleElement.style.opacity = "1";
        this.subtitleElement.textContent = text;
        this.isDialogOpen = true;
    }

    hideSubtitle() {
        if (!this.subtitleElement) return;
        this.subtitleElement.style.transition = "opacity 0.5s ease-in-out";
        this.subtitleElement.style.opacity = "0";
        this.subtitleElement.textContent = "";
        this.isDialogOpen = false;
    }

    displayDialog(dialogData: DialogInteraction) {
        const entries = Object.entries(dialogData);
        console.log("entries", entries)
        let totalDelayToClose = 0;

        entries.forEach(([_, item]) => {
            setTimeout(() => {
                this.showSubtitle(item.dialog);
            }, totalDelayToClose);

            totalDelayToClose += item.step;
        });

        setTimeout(() => {
            this.hideSubtitle();
        }, totalDelayToClose);
    }
}


// {
//     "first_interaction": {
//      "scene1": "Welcome 1",
//      "scene2": "Welcome 2",
//     },
//     "second_interaction": {
//         "scene1": "Welcome 3",
//         "scene2": "Welcome 4"
//     }
// }