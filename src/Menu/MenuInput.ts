import { EventEmitter, Experience } from "@plugins/baseExperience";
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
		document.addEventListener("keyup", this.onKeyUp);

		this.state.on("currentItemChanged.input", this.onCurrentItemChanged);
	}

	private onCurrentItemChanged = () => {
		// If something else cleared the selection, drop the toggle anchor so
		// pressing the same key again selects rather than no-ops.
		if (this.state.getCurrentItemId() === "") {
			this.lastPressedKeyIndex = null;
		}
	};

	private onKeyUp = (event: KeyboardEvent) => {
		const keyIndex = parseInt(event.key) - 1;
		if (Number.isNaN(keyIndex)) return;

		const item = this.state.getItemList()[keyIndex];
		if (!item) return;

		if (this.lastPressedKeyIndex === keyIndex) {
			this.state.clearCurrentItem();
			this.lastPressedKeyIndex = null;
		} else {
			this.state.setCurrentItem(item.id);
			this.lastPressedKeyIndex = keyIndex;
		}

		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
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
		document.removeEventListener("keyup", this.onKeyUp);
		this.state.off(".input");
	}
}
