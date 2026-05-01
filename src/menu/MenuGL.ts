import type MenuState from "./MenuState";
import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import * as THREE from "three"
import type { GLTF } from "three/examples/jsm/Addons.js";
/**
 * MenuView — DOM rendering for the menu.
 *
 * Responsibility: renders one button per item inside a host container and
 * reflects MenuState changes in the DOM (re-render on list change, toggle
 * the `active` class on selection change). Holds no game state and does
 * not listen to user input — it is a pure observer of MenuState.
 */
export default class MenuView {
	private state: MenuState;
	private container: HTMLElement;
	private buttons: { id: string; el: HTMLButtonElement }[] = [];
	private experience: Experience;
	private scene: THREE.Scene;
	private declare herbium: THREE.Group;
	private readonly localOffset = new THREE.Vector3(0, -0.275, -0.25);
	private readonly baseRotation = new THREE.Quaternion().setFromAxisAngle(
		new THREE.Vector3(0.1, 1, -0.1),
		-90 * Math.PI / 180
	);

	constructor(state: MenuState, containerId: string) {
		this.state = state;

		if (!Experience.instance)
			throw new Error("Menu: Experience is not initialized");

		this.experience = Experience.instance;
		this.scene = this.experience.scene



		const container = document.getElementById(containerId);
		if (!container)
			throw new Error(
				`MenuView: container "${containerId}" not found`
			);
		this.container = container;

		this.state.on("itemListChanged.menuView", this.onItemListChanged);
		this.state.on("currentItemChanged.menuView", this.onCurrentItemChanged);

		// this.render();
		this.init()
		console.log(this.experience.camera.instance.position)
	}

	private onItemListChanged = () => this.render();
	private onCurrentItemChanged = () => this.updateActive();


	init() {
		console.log(this.experience.resources.items.herbarium)

		this.herbium = (this.experience.resources.items.herbarium as GLTF).scene
		this.scene.add(this.herbium)
	}

	update() {
		const camera = this.experience.camera.instance;
		const worldOffset = this.localOffset.clone().applyQuaternion(camera.quaternion);
		this.herbium.position.copy(camera.position).add(worldOffset);
		this.herbium.quaternion.copy(camera.quaternion).multiply(this.baseRotation);
	}

	private render() {
	}
	/*
		private render() {
			console.log("here")
			this.container.innerHTML = "";
			this.buttons = [];
	
			const items = this.state.getItemList();
			for (const item of items) {
				const button = document.createElement("button");
				button.style.marginRight = "4px";
				button.innerHTML = item.name;
	
				if (item.vignet) {
					const img = document.createElement("img");
					img.src = item.vignet;
					img.style.width = "40px";
					img.style.height = "40px";
					img.style.objectFit = "cover";
					img.style.marginRight = "4px";
					button.appendChild(img);
				}
	
				this.container.appendChild(button);
				this.buttons.push({ id: item.id, el: button });
			}
	
			this.updateActive();
		}
	*/
	private updateActive() {
		// const currentId = this.state.getCurrentItemId();
		// for (const { id, el } of this.buttons) {
		// 	if (id === currentId && currentId !== "") {
		// 		el.classList.add("active");
		// 	} else {
		// 		el.classList.remove("active");
		// 	}
		// }

	}

	destroy() {
		this.state.off(".menuView");
		this.container.innerHTML = "";
		this.buttons = [];
	}
}
