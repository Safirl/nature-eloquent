import { Experience, type InputEventArgs } from "base-experience";
import type InteractableObject from "../interactable/InteractableObject";

export default class BookInteraction {
  declare bookSelectorInterface: HTMLElement;
  declare isCloseToInteractable: InteractableObject | null;
  declare isOpen: boolean;
  constructor() {
    // Récupération du DOM book-slector-interface
    const bookSelectorInterface = document.getElementById(
      "book-selector-interface",
    );
    if (!bookSelectorInterface) {
      return;
    }
    this.bookSelectorInterface = bookSelectorInterface;

    this.isOpen = false;
    this.isCloseToInteractable = null;
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
          "is close to an interactable object",
          this.isCloseToInteractable,
        );
      },
    );

    // INTERACTION 2 : Ouverture du carnet de sélection
    Experience.instance.inputSystem.on("interact", this.onInteract);
  }

  onInteract = (args: InputEventArgs): void => {
    if (args.type !== "pressed") {
      return;
    }
    if (this.isCloseToInteractable === null) {
      console.log("le joueur n'est pas proche de l'objet");
    }
  };
}
