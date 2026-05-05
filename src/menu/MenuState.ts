import { EventEmitter } from "@plugins/baseExperience";
import itemsList, { type MenuItemType } from "../resources/items";
import { it } from "vitest";

/**
 * MenuState — source of truth for the menu item state.
 *
 * Responsibility: holds the list of available menu items and the currently
 * selected item id. Has no DOM and no Three.js dependencies. Emits events
 * when its state changes so observers (the DOM view, the orchestrator,
 * etc.) can react without owning the state themselves.
 *
 * Events:
 *   - "itemListChanged"     — the items array was replaced
 *   - "currentItemChanged"  — the selected id changed (may be "" for none)
 */
export default class MenuState extends EventEmitter {
	private itemList: MenuItemType[] = [];
	private currentItem: string = "";

	constructor() {
		super();
	}

	setCurrentItem(item: string | MenuItemType) {
		const id = typeof item === "string" ? item : item.id;
		const found = itemsList.find((it) => it.id === id);

		if (!found) {
			throw "ERROR: The item you're trying to set doesn't exists. [MenuState.ts]";
		}

		if (this.currentItem === found.id) return;

		this.currentItem = found.id;
		this.trigger("currentItemChanged");
	}

	clearCurrentItem() {
		if (this.currentItem === "") return;
		this.currentItem = "";
		this.trigger("currentItemChanged");
	}

	setItemList(list: string[] | MenuItemType[]) {
		const safeList = this.getSafeList(list);
		this.itemList = safeList;
		this.trigger("itemListChanged");
	}

	pushItems(list: string[] | MenuItemType[]) {
		const safeList = this.getSafeList(list);
		this.itemList = this.itemList.concat(safeList);
		this.trigger("itemListChanged");
	}

	removeItems(list: string[] | MenuItemType[]) {
		list.forEach((e) => {
			let matchingElement: MenuItemType | undefined;
			if (typeof e === "string") {
				matchingElement = this.itemList.find((item) => item.id === e);
			} else {
				matchingElement = this.itemList.find((item) => item.id === e.id);
			}
			if (!matchingElement) return;
			const index = this.itemList.indexOf(matchingElement);
			if (index > -1) {
				this.itemList.splice(index, 1);
			}
		});
		this.trigger("itemListChanged");
	}

	getSafeList(list: string[] | MenuItemType[]): MenuItemType[] {
		const safeList = list
			.map((item) => {
				if (typeof item === "string") {
					const found = itemsList.find((it) => it.id === item);

					if (!found) {
						console.error(`Item not found: ${item}`);
					}

					return found;
				}

				return item;
			})
			.filter((item) => item != null) as MenuItemType[];
		return safeList;
	}

	nextItem() {
		if (this.itemList.length === 0) return;
		const currentIndex = this.itemList.findIndex((item) => item.id === this.currentItem);
		const nextIndex = (currentIndex + 1) % this.itemList.length;
		const nextId = this.itemList[nextIndex].id;
		if (nextId === this.currentItem) return;
		this.currentItem = nextId;
		this.trigger("currentItemChanged");
	}

	prevItem() {
		if (this.itemList.length === 0) return;
		const currentIndex = this.itemList.findIndex((item) => item.id === this.currentItem);
		const prevIndex = (currentIndex - 1 + this.itemList.length) % this.itemList.length;
		const prevId = this.itemList[prevIndex].id;
		if (prevId === this.currentItem) return;
		this.currentItem = prevId;
		this.trigger("currentItemChanged");
	}

	getCurrentItem(): MenuItemType | undefined {
		return this.itemList.find((it) => it.id === this.currentItem);
	}

	getCurrentItemId(): string {
		return this.currentItem;
	}

	getItemList(): MenuItemType[] {
		return this.itemList;
	}
}
