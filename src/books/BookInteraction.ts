import { EventEmitter, Experience, type InputEventArgs } from "@plugins/baseExperience";
import type InteractableObject from "../interactable/InteractableObject";
import BookDrawing from "./BookDrawing";

export default class BookInteraction extends EventEmitter {
	declare bookSelectorInterface: HTMLElement;
	declare bookDrawingInterface: HTMLElement;
	declare bookInterface: HTMLElement;
	declare nameObjectSelectedElement: HTMLElement;
	declare bookDrawingInterfaceValidate: HTMLButtonElement;

	declare closeBookSelectorButton: HTMLButtonElement;
	declare closeBookDrawingButton: HTMLButtonElement;
	declare isCloseToInteractable: InteractableObject | null;
	declare isOpenBookSelector: boolean;
	declare isOpenBookDrawing: boolean;

	declare bookDrawing: BookDrawing | null;

	declare isHalfOpenBookDrawing: boolean;
	declare isFullOpenBookDrawing: boolean;

	declare objectsCollected: InteractableObject[];
	declare bookSelectionInterfaceValidate: HTMLButtonElement | null;

	declare stickerObject: string[];


	constructor() {
		super();

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
		const nameObjectSelectedElement = document.querySelector(
			".name-object-selected",
		);
		const bookDrawingInterfaceValidate = document.querySelector(
			".validate-book-drawing"
		);

		if (
			!bookSelectorInterface ||
			!bookInterface ||
			!closeBookSelectorButton ||
			!bookDrawingInterface ||
			!closeBookDrawingButton ||
			!nameObjectSelectedElement ||
			!bookDrawingInterfaceValidate
		) {
			return;
		}

		this.bookSelectorInterface = bookSelectorInterface;
		this.bookDrawingInterface = bookDrawingInterface;
		this.bookInterface = bookInterface;
		this.nameObjectSelectedElement = nameObjectSelectedElement as HTMLElement;
		this.closeBookSelectorButton = closeBookSelectorButton as HTMLButtonElement;
		this.closeBookDrawingButton = closeBookDrawingButton as HTMLButtonElement;
		this.bookDrawingInterfaceValidate = bookDrawingInterfaceValidate as HTMLButtonElement;

		this.isFullOpenBookDrawing = false;
		this.isHalfOpenBookDrawing = false;
		this.isOpenBookSelector = false;
		this.isOpenBookDrawing = false;

		this.objectsCollected = [];
		this.bookSelectionInterfaceValidate = null;

		this.stickerObject = ['champignon', 'interactableMushroom2'];

		// this.bookDrawing = new BookDrawing();

		this.isCloseToInteractable = null;
		this.updateBookSelectorVisibility();
		this.registerEventToggleBook();
		this.renderCollectedObjects();
	}

	/* 
		REGISTER BIND INPUT EVENTS
	*/

	registerEventToggleBook(): void {
		if (!Experience.instance) return;
		this.registerEventsUI();
		this.registerEventsBookCollectControls(Experience.instance);
		this.registerEventsProximityDetection(Experience.instance);
	}

	registerEventsUI(): void {
		this.closeBookSelectorButton.addEventListener(
			"click",
			this.onCloseBookSelector,
		);
		this.closeBookDrawingButton.addEventListener(
			"click",
			this.onCloseBookDrawing,
		);
		this.bookDrawingInterfaceValidate.addEventListener(
			"click",
			this.validateDropObject
		);
	}

	registerEventsBookCollectControls(instance: Experience): void {
		instance.camera.on(
			"onInteractionPressed",
			(args: (InteractableObject | null)[]) => {
				if (this.isHalfOpenBookDrawing) {
					this.fullOpenBookDrawing(args);
				} else {
					this.halfOpenBookDrawing(args);
				}
			},
		);
		instance.inputSystem.on("interact", this.onOpenBookSelector);
	}

	registerEventsProximityDetection(instance: Experience): void {
		instance.camera.on("onSelectedObjectChanged", (args: (InteractableObject | null)[]) => {
			const object = Array.isArray(args) ? args[0] : args;
			this.isCloseToInteractable = object;

			if (!object) {
				this.onCloseBookDrawing();
				return;
			}
			if (this.isOpenBookSelector) this.setBookSelectorOpen(false);
			this.halfOpenBookDrawing(args);
		});
	}


	validateDropObject = (): void => {
		if (!this.isCloseToInteractable) return;

		const alreadyCollected = this.objectsCollected.find(
			(obj) => obj.getId() === this.isCloseToInteractable?.getId(),
		);
		if (!alreadyCollected) {
			this.objectsCollected.push(this.isCloseToInteractable);
		}

		console.log("Le tableau d'objet :", this.objectsCollected);
		this.onCloseBookDrawing();
		this.renderCollectedObjects();
	};

	halfOpenBookDrawing(object: (InteractableObject | null)[]): void {
		this.setBookDrawingOpen(object, false);
	}

	fullOpenBookDrawing(object: (InteractableObject | null)[]): void {
		this.setBookDrawingOpen(object, true);
	}

	setBookDrawingOpen(object: (InteractableObject | null)[], isBookDrawingFullOpen: boolean): void {
		if (!this.isCloseToInteractable) return;

		this.displayTargetNameObjectUI(object);
		this.bookSelectorInterface.style.display = "none";
		this.bookInterface.style.display = "flex";
		this.bookDrawingInterface.style.display = "flex";
		this.isOpenBookDrawing = false;

		if (isBookDrawingFullOpen) {
			this.bookInterface.classList.remove("half-open-book-interface");
			this.isHalfOpenBookDrawing = false;
			this.setPointerLock(false);
		} else {
			this.bookInterface.classList.add("half-open-book-interface");
			this.isHalfOpenBookDrawing = true;
			this.setPointerLock(true);
		}
	}

	onCloseBookDrawing = (): void => {
		this.bookSelectorInterface.style.display = "none";
		this.bookInterface.style.display = "none";
		this.bookInterface.classList.remove("half-open-book-interface");
		this.bookDrawingInterface.style.display = "none";
		this.isOpenBookDrawing = false;
		this.setPointerLock(true);
		this.isHalfOpenBookDrawing = false;
	};

	displayTargetNameObjectUI = (args: (InteractableObject | null)[]): void => {
		const object = Array.isArray(args) ? args[0] : args;
		const selectedObjectName = object?.name;
		const selectedObjectId = object?.getId();
		this.nameObjectSelectedElement.textContent = selectedObjectName
			? `Nom de l'objet: ${selectedObjectName} (${selectedObjectId})`
			: "Aucun objet sélectionné";
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
		this.setPointerLock(false);
		this.updateBookSelectorVisibility();
	};

	//   Mettre à jour visibilité du style en HTML
	updateBookSelectorVisibility = (): void => {
		const displayBook = this.isOpenBookSelector ? "flex" : "none";
		this.bookInterface.style.display = displayBook;
		this.bookSelectorInterface.style.display = displayBook;
		this.bookDrawingInterface.style.display = "none";
		if (!this.isOpenBookSelector) {
			this.setPointerLock(true);
		}
	};

	setPointerLock(locked: boolean): void {
		if (locked) {
			document.body.requestPointerLock();
		} else {
			document.exitPointerLock();
		}
	}

	// Affiche les objets collectés dans le carnet de sélection
	renderCollectedObjects(): void {
		const collectedObjectsUI = this.bookSelectorInterface.querySelectorAll(
			".collected-object-btn, .collected-object-sticker-button, .collected-object-sticker",
		);
		collectedObjectsUI.forEach((el) => el.remove());

		// Si pas objet collecté
		if (this.objectsCollected.length === 0) {
			const noCollected = document.createElement("p");
			noCollected.classList.add("collected-object-btn");
			noCollected.textContent = "Vous n'avez encore rien collecté";
			this.bookSelectorInterface.appendChild(noCollected);
			return;
		}

		// Création des stickers d'ilmage
		for (const obj of this.objectsCollected) {
			const stickerName = this.stickerObject.find(sticker => obj.name.toLowerCase().includes(sticker.toLowerCase()));
			if (stickerName) {
				const img = document.createElement("img");
				img.src = `./src/books/${stickerName}.png`;
				img.classList.add("collected-object-sticker");
				img.alt = obj.name;
				// Affichage aléatoire de l'img dans le carnet de sélection
				img.style.position = "absolute";
				img.style.top = `${Math.random() * 80 + 10}%`;
				img.style.left = `${Math.random() * 80 + 10}%`;
				img.style.cursor = "pointer";

				this.bookSelectorInterface.appendChild(img);

				img.addEventListener("click", () => {
					this.trigger("onCollectedObjectSelected", [obj]);
					this.fullOpenBookDrawing([obj]);
					console.log("objet a ete clique", obj.name);
				});
			}
		}
	}
}
