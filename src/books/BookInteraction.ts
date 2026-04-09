import { Experience, type InputEventArgs } from "base-experience";
import type InteractableObject from "../interactable/InteractableObject";

export default class BookInteraction {
  declare bookSelectorInterface: HTMLElement;
  declare bookInterface: HTMLElement;
  declare closeBookSelectorButton: HTMLButtonElement;
  declare isCloseToInteractable: InteractableObject | null;
  declare isOpenBookSelector: boolean;

  constructor() {
    const bookSelectorInterface = document.getElementById(
      "book-selector-interface",
    );
    const bookInterface = document.getElementById("book-interface");
    const closeBookSelectorButton = document.getElementById(
      "close-book-selector",
    );

    if (!bookSelectorInterface) {
      return;
    }
    if (!bookInterface) {
      return;
    }
    if (!closeBookSelectorButton) {
      return;
    }

    this.bookSelectorInterface = bookSelectorInterface;
    this.bookInterface = bookInterface;
    this.closeBookSelectorButton = closeBookSelectorButton as HTMLButtonElement;

    this.isOpenBookSelector = false;
    this.isCloseToInteractable = null;
    this.updateBookSelectorVisibility();
    this.registerEventToggleBook();
  }

  //   Tous les événements d'affichage du carnet
  registerEventToggleBook(): void {
    if (!Experience.instance) return;

    // INTERACTION 1 : Entrouvrir le carnet si le joueur proche obj interactif
    Experience.instance.camera.on(
      "onSelectedObjectChanged",
      (args: InteractableObject | null) => {
        this.isCloseToInteractable = args ?? null;
        console.log(
          "Entrouvrir le carnet de dessin avec l'objet :",
          this.isCloseToInteractable,
        );

        // Si le joueur a ouvert son carnet de sélection devant un objet interactif -> on ferme le carneet de sélection
        if (this.isCloseToInteractable && this.isOpenBookSelector) {
          this.setBookSelectorOpen(false);
        }
      },
    );

    // INTERACTION 2 : Ouverture du carnet de sélection
    Experience.instance.inputSystem.on("interact", this.onOpenBookSelector);
    this.closeBookSelectorButton.addEventListener(
      "click",
      this.onCloseBookSelector,
    );
  }

  //   INTERACTION 2 : Ouverture du carnet de sélection
  onOpenBookSelector = (args: InputEventArgs): void => {
    if (args.type !== "pressed") {
      return;
    }
    if (this.isCloseToInteractable === null) {
      console.log("le joueur n'est pas proche de l'objet");
      this.setBookSelectorOpen(!this.isOpenBookSelector);
    }
  };

  //   INTERACTION 2 : Fermeture du carnet de sélection
  onCloseBookSelector = (): void => {
    this.setBookSelectorOpen(false);
  };

  //   INTERACTION 2 : On affiche ou non le carnet de sélection
  setBookSelectorOpen = (isOpen: boolean): void => {
    this.isOpenBookSelector = isOpen;
    document.exitPointerLock();
    this.updateBookSelectorVisibility();
  };

  //   INTERACTION 2 : Permet de togler la visibilité du carnet de sélection
  updateBookSelectorVisibility = (): void => {
    const displayBook = this.isOpenBookSelector ? "flex" : "none";
    this.bookInterface.style.display = displayBook;
    this.bookSelectorInterface.style.display = displayBook;
    if (!this.isOpenBookSelector) {
      document.body.requestPointerLock();
    }
  };
}
