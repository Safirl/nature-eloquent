import { EventEmitter, Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import MenuState from "./MenuState";
import MenuGL from "./MenuGL";
import MenuInput from "./MenuInput";
import Placement from "../interactions/Placement";
import SubtitleManager from "../resources/subtitle/SubtitleManager";
import dialogSubtitleAudio from "../resources/subtitle/dialogSubtitleAudio.json";
import type { DialogStep } from "../scene/sceneDescriptions";
import { type MenuItemType } from "../resources/items";
import TriggerManager from "../trigger/TriggerManager";
import type GameExperience from "../GameExperience";
// import mushroomIcon from "../books/mushroom.png";

/**
 * Menu — orchestrator of the menu-driven interaction system.
 *
 * Responsibility: composes the four collaborators below and wires the
 * events between them. Holds no DOM, no input handling, and no Three.js
 * code of its own — it owns the system lifecycle (LifeTimeObject), the
 * resource → mesh resolution that bridges menu items to Placement, and
 * the narrative concern of triggering dialog playback at specific
 * placement counts.
 *
 * Collaborators:
 *   - MenuState  — item-state source of truth (selected id + list)
 *   - MenuGL   — DOM observer of MenuState (renders buttons + active state)
 *   - MenuInput  — mouse/keyboard listeners; drives MenuState and emits placeRequested
 *   - Placement  — generic Three.js placement primitive (registered per item)
 */
export default class Menu extends EventEmitter implements LifeTimeObject {
	public enabled: boolean = true;
	private experience: GameExperience;

	private state: MenuState;
	public view: MenuGL;
	private input: MenuInput;
	private placement: Placement;

	public subtitle: SubtitleManager;
	declare dialogsAudio: {
		[key: string]: { [value: string]: { audio: string; dialog: string; speaker: string } };
	};

	private buttonContainerId = "tool-selector";

	constructor() {
		super();
		if (!Experience.instance) throw new Error("Menu: Experience is not initialized");
		this.experience = Experience.instance as GameExperience;

		this.subtitle = new SubtitleManager();
		this.dialogsAudio = dialogSubtitleAudio;

		this.state = new MenuState();
		this.view = new MenuGL(this.state, this.buttonContainerId);
		this.input = new MenuInput(this.state, this.experience.canvas);
		this.placement = new Placement();

		this.state.on("itemListChanged.menu", this.onItemListChanged);
		this.input.on("placeRequested.menu", this.onPlaceRequested);
	}

	init = () => {
		this.experience.sceneManager.on("onActiveStepAdded", this.onActiveStepAdded);
	};

	private onActiveStepAdded = (dialogueStep: DialogStep) => {
		const oldItems = dialogueStep.objectsRemoved;
		if (oldItems) {
			this.state.removeItems(oldItems);
		}
		const newItems = dialogueStep.objectsAdded?.map((i) => {
			return i.objectId;
		});
		if (newItems) {
			this.state.pushItems(newItems);
		}
		if (dialogueStep.dialogId) {
			this.playDialog(dialogueStep.dialogId);
		}
	};

	private onItemListChanged = () => {
		this.placement.unregisterAll();
		for (const item of this.state.getItemList()) {
			const resource = this.experience.resources.items[item.model] as GLTF;
			if (!resource) {
				console.warn("found invalid resource for: ", item.model);
				continue;
			}
			let baseMesh;
			if (item.isActor) {
				baseMesh = resource;
			} else {
				baseMesh = resource.scene.children[0] as THREE.Mesh;
			}
			this.placement.register(item.id, baseMesh);
		}
	};

	private onPlaceRequested = () => {
		const currentId = this.state.getCurrentItemId();
		if (!currentId) return;
		const count = this.placement.place(currentId);
		if (count === null) return;
		this.trigger("onObjectPlaced", [currentId]);
	};

	private playDialog(itemId: string) {
		const dialogData = this.dialogsAudio[itemId];
		this.subtitle.displayDialog(dialogData);
	}

	update = () => {
		this.placement.update();
		this.view.update();
	};
	destroy = () => {
		this.state.off(".menu");
		this.input.off(".menu");
		this.experience.sceneManager.off("onActiveStepAdded");
		this.input.destroy();
		this.view.destroy();
		this.placement.destroy();
	};
}
