import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import MenuState from "./MenuState";
import MenuView from "./MenuView";
import MenuInput from "./MenuInput";
import Placement from "../interactions/Placement";
import SubtitleManager from "../subtitle/SubtitleManager";
import dialogSubtitleAudio from "../subtitle/dialogSubtitleAudio.json";

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
 *   - MenuView   — DOM observer of MenuState (renders buttons + active state)
 *   - MenuInput  — mouse/keyboard listeners; drives MenuState and emits placeRequested
 *   - Placement  — generic Three.js placement primitive (registered per item)
 */
export default class Menu implements LifeTimeObject {
	public enabled: boolean = true;
	private experience: Experience;

	private state: MenuState;
	private view: MenuView;
	private input: MenuInput;
	private placement: Placement;

	private subtitle: SubtitleManager;
	private dialogsAudio: typeof dialogSubtitleAudio;

	private buttonContainerId = "tool-selector";
	private initialItemIds = ["mushroom", "mushroom2", "mushroomCouc"];

	constructor() {
		if (!Experience.instance)
			throw new Error("Menu: Experience is not initialized");
		this.experience = Experience.instance;

		this.subtitle = new SubtitleManager();
		this.dialogsAudio = dialogSubtitleAudio;

		this.state = new MenuState();
		this.view = new MenuView(this.state, this.buttonContainerId);
		this.input = new MenuInput(this.state, this.experience.canvas);
		this.placement = new Placement();

		this.state.on("itemListChanged.menu", this.onItemListChanged);
		this.input.on("placeRequested.menu", this.onPlaceRequested);

		this.state.setItemList(this.initialItemIds);
	}

	private onItemListChanged = () => {
		this.placement.unregisterAll();
		for (const item of this.state.getItemList()) {
			const resource = this.experience.resources.items[
				item.model
			] as GLTF;
			if (!resource) {
				console.warn("found invalid resource for: ", item.model);
				continue;
			}
			const baseMesh = resource.scene.children[0] as THREE.Mesh;
			this.placement.register(item.id, baseMesh);
		}
	};

	private onPlaceRequested = () => {
		const currentId = this.state.getCurrentItemId();
		if (!currentId) return;
		const count = this.placement.place(currentId);
		if (count === null) return;
		this.maybePlayDialog(currentId, count);
	};

	private maybePlayDialog(itemId: string, count: number) {
		// Ex d'enchaînement du dialogue en fonction du nombre d'objets placés.
		if (itemId !== "mushroom") return;
		if (count === 1) {
			this.subtitle.displayDialog(
				this.dialogsAudio.dinosaur_interaction_1
			);
		} else if (count === 5) {
			this.subtitle.displayDialog(
				this.dialogsAudio.dinosaur_interaction_2
			);
		}
	}

	init = () => { };
	update = () => {
		this.placement.update();
	};
	destroy = () => {
		this.state.off(".menu");
		this.input.off(".menu");
		this.input.destroy();
		this.view.destroy();
		this.placement.destroy();
	};
}
