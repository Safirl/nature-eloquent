import { Experience, type InputEventArgs } from "base-experience";
import type InteractableObject from "../interactable/InteractableObject";
import BookDrawing from "./BookDrawing";

export default class BookInteraction {
	declare bookSelectorInterface: HTMLElement;
	declare bookDrawingInterface: HTMLElement;
	declare bookInterface: HTMLElement;
	declare closeBookSelectorButton: HTMLButtonElement;
	declare closeBookDrawingButton: HTMLButtonElement;
	declare isCloseToInteractable: InteractableObject | null;
	declare isOpenBookSelector: boolean;
	declare isOpenBookDrawing: boolean;

	declare bookDrawing: BookDrawing | null;

	declare isHalfOpenBookDrawing: boolean;

	//   @TODO : tableau d'objet récupéré depuis le Player
	declare objectCollected: InteractableObject[] | null;

	constructor() {
		const bookSelectorInterface = document.getElementById(
			"book-selector-interface",
		);
		const bookDrawingInterface = document.getElementById(
			"book-drawing-interface",
		);
		const bookInterface = document.getElementById("book-interface");
		const closeBookSelectorButton = document.getElementById(
			"close-book-selector",
		);
		const closeBookDrawingButton =
			document.getElementById("close-book-drawing");

		if (
			!bookSelectorInterface ||
			!bookInterface ||
			!closeBookSelectorButton ||
			!bookDrawingInterface ||
			!closeBookDrawingButton
		) {
			return;
		}

		this.bookSelectorInterface = bookSelectorInterface;
		this.bookDrawingInterface = bookDrawingInterface;
		this.bookInterface = bookInterface;
		this.closeBookSelectorButton = closeBookSelectorButton as HTMLButtonElement;
		this.closeBookDrawingButton = closeBookDrawingButton as HTMLButtonElement;

		this.isHalfOpenBookDrawing = false;
		this.isOpenBookSelector = false;
		this.isOpenBookDrawing = false;

		this.bookDrawing = new BookDrawing();


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

				this.halfOpenBookDrawing();

				// Si le joueur s'éloigne de l'objet interactif où le carnet est déjà actif
				if (!this.isCloseToInteractable) {
					this.onCloseBookDrawing();
				}

				// Si le joueur a ouvert son carnet de sélection devant un objet interactif -> on ferme le carneet de sélection
				if (this.isCloseToInteractable && this.isOpenBookSelector) {
					this.setBookSelectorOpen(false);
				}
			},
		);

		// INTERACTION 3 : Ouverture du carnet de dessin en entier
		Experience.instance?.camera.on(
			"onInteractionPressed",
			(args: InteractableObject | null) => {
				console.log('arg name', args?.getId());
				this.openBookDrawing();
			},
		);

		// INTERACTION 2 : Ouverture du carnet de sélection
		Experience.instance.inputSystem.on("interact", this.onOpenBookSelector);

		this.closeBookSelectorButton.addEventListener(
			"click",
			this.onCloseBookSelector,
		);
		this.closeBookDrawingButton.addEventListener(
			"click",
			this.onCloseBookDrawing,
		);
	}

	// Ouverture du carnet de drawing entièrement
	openBookDrawing(): void {
		if (!this.isCloseToInteractable) return;
		console.log("ouverture du carnet en entier !");
		this.bookSelectorInterface.style.display = "none";
		this.bookInterface.style.display = "flex";
		this.bookInterface.classList.remove("half-open-book-interface");
		this.bookDrawingInterface.style.display = "flex";
		this.isOpenBookDrawing = true;
		document.exitPointerLock();
		this.isHalfOpenBookDrawing = false;
	}

	halfOpenBookDrawing(): void {
		if (!this.isCloseToInteractable) return;
		console.log("entrouverture du carnet !");
		this.bookSelectorInterface.style.display = "none";
		this.bookInterface.style.display = "flex";
		this.bookInterface.classList.add("half-open-book-interface");
		this.bookDrawingInterface.style.display = "flex";
		this.isOpenBookDrawing = true;
		this.isHalfOpenBookDrawing = true;

	}

	onCloseBookDrawing = (): void => {
		this.bookSelectorInterface.style.display = "none";
		this.bookInterface.style.display = "none";
		// this.bookInterface.classList.remove("half-open-book-interface");
		this.bookDrawingInterface.style.display = "none";
		this.isOpenBookDrawing = false;
		document.body.requestPointerLock();
		this.isHalfOpenBookDrawing = false;
	};

	/* INTERACTION POUR LA FERMETURE / OUVERTURE DU CARNET DE SELECTION */

	//  Clique sur "E" pour ouvrir le carnet de sélection
	onOpenBookSelector = (args: InputEventArgs): void => {
		if (args.type !== "pressed") {
			return;
		}
		if (this.isCloseToInteractable === null) {
			console.log("le joueur n'est pas proche de l'objet");
			this.setBookSelectorOpen(!this.isOpenBookSelector);
		}
	};

	//  Clique sur la croix pour fermer le carnet de sélection
	onCloseBookSelector = (): void => {
		this.setBookSelectorOpen(false);
	};

	//   Toggle la visibilité du carnet de sélection
	setBookSelectorOpen = (isOpen: boolean): void => {
		this.isOpenBookSelector = isOpen;
		document.exitPointerLock();
		this.updateBookSelectorVisibility();
	};

	//   Mettre à jour visibilité du style en HTML
	updateBookSelectorVisibility = (): void => {
		const displayBook = this.isOpenBookSelector ? "flex" : "none";
		this.bookInterface.style.display = displayBook;
		this.bookSelectorInterface.style.display = displayBook;
		this.bookDrawingInterface.style.display = "none";
		if (!this.isOpenBookSelector) {
			document.body.requestPointerLock();
		}
	};
}
