import { beforeEach, describe, expect, it } from "vitest";
import MenuState from "../MenuState";
import itemsList from "../../resources/items";

describe("MenuState", () => {
	let state: MenuState;

	beforeEach(() => {
		state = new MenuState();
		state.setItemList([itemsList[0], itemsList[1]]);
	});

	describe("setItemList", () => {
		it("accepts MenuItemType objects", () => {
			state.setItemList([itemsList[0], itemsList[1]]);
			expect(state["itemList"]).toHaveLength(2);
		});

		it("accepts id strings", () => {
			state.setItemList([itemsList[0].id, itemsList[1].id]);
			expect(state["itemList"]).toHaveLength(2);
		});

		it("ignores unknown ids", () => {
			state.setItemList(["unknown-id", itemsList[0].id]);
			expect(state["itemList"]).toHaveLength(1);
		});
	});

	describe("setCurrentItem", () => {
		it("sets the current item by id string", () => {
			state.setCurrentItem(itemsList[0].id);
			expect(state["currentItem"]).toBe(itemsList[0].id);
		});

		it("sets the current item by MenuItemType object", () => {
			state.setCurrentItem(itemsList[1]);
			expect(state["currentItem"]).toBe(itemsList[1].id);
		});

		it("throws when the item does not exist", () => {
			expect(() => state.setCurrentItem("non-existent")).toThrow();
		});
	});

	describe("nextItem", () => {
		it("moves to the next item", () => {
			state.setCurrentItem(itemsList[0].id);
			state.nextItem();
			expect(state["currentItem"]).toBe(itemsList[1].id);
		});

		it("wraps around from the last item to the first", () => {
			state.setCurrentItem(itemsList[2].id);
			state.nextItem();
			expect(state["currentItem"]).toBe(itemsList[0].id);
		});

		it("selects the first item when nothing is selected", () => {
			state["currentItem"] = "";
			state.nextItem();
			expect(state["currentItem"]).toBe(itemsList[0].id);
		});

		it("does nothing on an empty list", () => {
			state.setItemList([]);
			state["currentItem"] = "";
			state.nextItem();
			expect(state["currentItem"]).toBe("");
		});
	});

	describe("prevItem", () => {
		it("moves to the previous item", () => {
			state.setCurrentItem(itemsList[1].id);
			state.prevItem();
			expect(state["currentItem"]).toBe(itemsList[0].id);
		});

		it("wraps around from the first item to the last", () => {
			state.setCurrentItem(itemsList[0].id);
			state.prevItem();
			expect(state["currentItem"]).toBe(itemsList[1].id);
		});

		it("selects the last item when nothing is selected", () => {
			state["currentItem"] = "";
			state.prevItem();
			expect(state["currentItem"]).toBe(itemsList[0].id);
		});

		it("does nothing on an empty list", () => {
			state.setItemList([]);
			state["currentItem"] = "";
			state.prevItem();
			expect(state["currentItem"]).toBe("");
		});
	});
});
