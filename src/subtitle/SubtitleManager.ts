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
    declare isDialogOpen: boolean;
    declare currentIndex: number;
    declare characterElement: HTMLElement;

    constructor() {
        this.init();
    }

    init() {
        this.subtitleElement = document.getElementById("subtitle") as HTMLElement;
        this.dialogElement = document.getElementById("dialog") as HTMLElement;
        this.subtitleElement.style.opacity = "0";
        this.isDialogOpen = false;
        this.characterElement = document.getElementById("character") as HTMLElement;
    }

    showSubtitle(text: string, characterName: string) {
        if (!this.subtitleElement) return;
        this.subtitleElement.style.transition = "opacity 0.5s ease-in-out";
        this.subtitleElement.style.opacity = "1";
        this.dialogElement.textContent = text;
        this.characterElement.textContent = characterName;
        this.isDialogOpen = true;
    }

    hideSubtitle() {
        if (!this.subtitleElement) return;
        this.subtitleElement.style.transition = "opacity 0.5s ease-in-out";
        this.subtitleElement.style.opacity = "0";
        this.isDialogOpen = false;
    }


    // Si on décide dejoue le dialogue automatiquement en fonction du delay de chaque dialogue
    displayDialog(dialogData: DialogInteraction) {
        if (this.isDialogOpen) return;
        const entries = Object.entries(dialogData);
        let totalDelayToClose = 0;

        entries.forEach(([_, item]) => {
            setTimeout(() => {
                this.showSubtitle(item.dialog, item.character);
            }, totalDelayToClose);
            totalDelayToClose += item.duration;
        });

        setTimeout(() => {
            this.hideSubtitle();
            this.isDialogOpen = false;
        }, totalDelayToClose);
    }

    // Si on décide de play le dialogue avec l'intéraction de l'utilisateur
    displayDialogOnClick(dialogData: DialogInteraction) {
        const entries = Object.entries(dialogData);
        console.log("entries: ", entries);
        if (entries.length === 0 || this.isDialogOpen) return;
        this.currentIndex = 0;
        this.isDialogOpen = true;

        const clickNextDialogHandler = () => {
            if (this.currentIndex < entries.length) {
                const [_, item] = entries[this.currentIndex];
                this.showSubtitle(item.dialog, item.character);
                this.currentIndex++;
            } else {
                this.hideSubtitle();
                document.removeEventListener("click", clickNextDialogHandler);
            }
        }

        document.addEventListener("click", clickNextDialogHandler);

        // // Init à 1 si l'utilisateur appuis sur une touche du clavier car le premier dialogue s'affiche lorsque le joueur place un objet dans
        // this.currentIndex = 1;

        // Si on décide que l'utilisateur doit appuyer sur une touche pour faire avance le dialogue
        // this.showSubtitle(entries[0][1].dialog);

        // Si l'on souhaite que l'utilisateur appuis sur une touche du clavier pour avancer le dialogue
        // const onKeyUp = (e: KeyboardEvent) => {
        //     if (e.code === "Enter") {
        //         clickNextDialogHandler();
        //         if (!this.isDialogOpen) document.removeEventListener("keyup", onKeyUp);
        //     }
        // };

        // document.addEventListener("keyup", onKeyUp);

    }
}