import { EventEmitter, Experience, type InputEventArgs } from "@plugins/baseExperience";
import { Vector2 } from "three";
import type MenuState from "./MenuState";

/**
 * MenuInput — input listening layer for the menu.
 *
 * Responsibility: subscribes to mouse and keyboard events on the canvas
 * and document. Translates digit-key presses into MenuState changes —
 * same key twice clears the selection, a different key switches it.
 * Forwards mouse-up clicks to the orchestrator as a "placeRequested"
 * event. Owns mouse screen position for potential pointer-based
 * raycasting (god mode).
 *
 * Events:
 *   - "placeRequested" (MouseEvent) — mouseup on the canvas (left/middle button only)
 */
export default class MenuInput extends EventEmitter {
	private state: MenuState;
	private canvas: HTMLCanvasElement;
	private mousePosition = new Vector2();
	private lastPressedKeyIndex: number | null = null;

	constructor(state: MenuState, canvas: HTMLCanvasElement) {
		super();
		this.state = state;
		this.canvas = canvas;

		this.canvas.addEventListener("mousemove", this.onMouseMove);
		this.canvas.addEventListener("mouseup", this.onMouseUp);

		this.state.on("currentItemChanged.input", this.onCurrentItemChanged);
		this.bindInputs();
	}

	bindInputs() {
		const exp = Experience.instance;
		if (!exp) return;
		for (let i = 1; i < 10; i++) {
			exp.inputSystem.on(`selectItem${i}`, (args: InputEventArgs) =>
				this.onItemKeyPressed(i, args)
			);
		}
		// exp.inputSystem.on(`selectItem1`, () => console.log("coucou"));
	}

	private onCurrentItemChanged = () => {
		// If something else cleared the selection, drop the toggle anchor so
		// pressing the same key again selects rather than no-ops.
		if (this.state.getCurrentItemId() === "") {
			this.lastPressedKeyIndex = null;
		}
	};

	private onItemKeyPressed = (i: number, args: InputEventArgs) => {
		if (args.type !== "released") return;
		const index = i - 1;
		const item = this.state.getItemList()[index];
		if (!item) return;

		if (this.lastPressedKeyIndex === index) {
			this.state.clearCurrentItem();
			this.lastPressedKeyIndex = null;
		} else {
			this.state.setCurrentItem(item.id);
			this.lastPressedKeyIndex = index;
		}
	};

	private onMouseMove = (event: MouseEvent) => {
		const sizes = Experience.instance?.sizes;
		if (!sizes) return;
		this.mousePosition.set(
			(event.clientX / sizes.width) * 2 - 1,
			-((event.clientY / sizes.height) * 2 - 1)
		);
	};

	private onMouseUp = (event: MouseEvent) => {
		if (event.button === 2) return;
		this.trigger("placeRequested", [event]);
	};

	getMousePosition(): Vector2 {
		return this.mousePosition;
	}

	destroy() {
		this.canvas.removeEventListener("mousemove", this.onMouseMove);
		this.canvas.removeEventListener("mouseup", this.onMouseUp);
		this.state.off(".input");
	}
}
