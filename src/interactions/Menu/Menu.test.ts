import { beforeEach, describe, expect, it } from "vitest"
import Menu from "./Menu"
import itemsList from "./Items"

describe("Menu", () => {
    let menu: Menu

    beforeEach(() => {
        menu = new Menu()
        menu.setItemList([itemsList[0], itemsList[1]])
    })

    describe("setItemList", () => {
        it("accepts MenuItemType objects", () => {
            menu.setItemList([itemsList[0], itemsList[1]])
            expect(menu["itemList"]).toHaveLength(2)
        })

        it("accepts id strings", () => {
            menu.setItemList([itemsList[0].id, itemsList[1].id])
            expect(menu["itemList"]).toHaveLength(2)
        })

        it("ignores unknown ids", () => {
            menu.setItemList(["unknown-id", itemsList[0].id])
            expect(menu["itemList"]).toHaveLength(1)
        })
    })

    describe("setCurrentItem", () => {
        it("sets the current item by id string", () => {
            menu.setCurrentItem(itemsList[0].id)
            expect(menu["currentItem"]).toBe(itemsList[0].id)
        })

        it("sets the current item by MenuItemType object", () => {
            menu.setCurrentItem(itemsList[1])
            expect(menu["currentItem"]).toBe(itemsList[1].id)
        })

        it("throws when the item does not exist", () => {
            expect(() => menu.setCurrentItem("non-existent")).toThrow()
        })
    })

    describe("nextItem", () => {
        it("moves to the next item", () => {
            menu.setCurrentItem(itemsList[0].id)
            menu.nextItem()
            expect(menu["currentItem"]).toBe(itemsList[1].id)
        })

        it("wraps around from the last item to the first", () => {
            menu.setCurrentItem(itemsList[2].id)
            menu.nextItem()
            expect(menu["currentItem"]).toBe(itemsList[0].id)
        })

        it("selects the first item when nothing is selected", () => {
            menu["currentItem"] = ""
            menu.nextItem()
            expect(menu["currentItem"]).toBe(itemsList[0].id)
        })

        it("does nothing on an empty list", () => {
            menu.setItemList([])
            menu["currentItem"] = ""
            menu.nextItem()
            expect(menu["currentItem"]).toBe("")
        })
    })

    describe("prevItem", () => {
        it("moves to the previous item", () => {
            menu.setCurrentItem(itemsList[1].id)
            menu.prevItem()
            expect(menu["currentItem"]).toBe(itemsList[0].id)
        })

        it("wraps around from the first item to the last", () => {
            menu.setCurrentItem(itemsList[0].id)
            menu.prevItem()
            expect(menu["currentItem"]).toBe(itemsList[1].id)
        })

        it("selects the last item when nothing is selected", () => {
            menu["currentItem"] = ""
            menu.prevItem()
            expect(menu["currentItem"]).toBe(itemsList[0].id)
        })

        it("does nothing on an empty list", () => {
            menu.setItemList([])
            menu["currentItem"] = ""
            menu.prevItem()
            expect(menu["currentItem"]).toBe("")
        })
    })
})
