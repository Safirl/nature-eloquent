import type MenuState from "./MenuState";

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

	constructor(state: MenuState, containerId: string) {
		this.state = state;

		const container = document.getElementById(containerId);
		if (!container)
			throw new Error(
				`MenuView: container "${containerId}" not found`
			);
		this.container = container;

		this.state.on("itemListChanged.menuView", this.onItemListChanged);
		this.state.on("currentItemChanged.menuView", this.onCurrentItemChanged);

		this.render();
	}

	private onItemListChanged = () => this.render();
	private onCurrentItemChanged = () => this.updateActive();

	private render() {
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

	private updateActive() {
		const currentId = this.state.getCurrentItemId();
		for (const { id, el } of this.buttons) {
			if (id === currentId && currentId !== "") {
				el.classList.add("active");
			} else {
				el.classList.remove("active");
			}
		}
	}

	destroy() {
		this.state.off(".menuView");
		this.container.innerHTML = "";
		this.buttons = [];
	}
}
