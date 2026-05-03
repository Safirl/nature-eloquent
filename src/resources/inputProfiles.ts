import type { InputProfile } from "@plugins/baseExperience";

export const BitControllerProfile: InputProfile = {
	id: "2dc8-301b-8BitDo Ultimate 2C Wireless",
	buttons: [
		{
			physicalInput: "A",
			index: 0,
			event: "jump",
		},
		{
			physicalInput: "X",
			index: 3,
			event: "interact",
		},
		{
			physicalInput: "B",
			index: 1,
			event: "cancel",
		},
		{
			physicalInput: "Y",
			index: 4,
			event: "inventory",
		},
	],
	axes: [
		{
			physicalInput: "leftStickXRight",
			index: 1,
			event: "right",
			sign: 1,
			deadzone: 0.01,
		},
		{
			physicalInput: "leftStickXLeft",
			index: 1,
			event: "left",
			sign: -1,
			deadzone: 0.01,
		},
		{
			physicalInput: "leftStickYUp",
			index: 2,
			event: "forward",
			sign: -1,
			deadzone: 0.01,
		},
		{
			physicalInput: "leftStickYDown",
			index: 2,
			event: "backward",
			sign: 1,
			deadzone: 0.01,
		},
		{
			physicalInput: "rightStickXRight",
			index: 3,
			event: "lookRight",
			sign: 1,
			deadzone: 0.01,
		},
		{
			physicalInput: "rightStickXLeft",
			index: 3,
			event: "lookLeft",
			sign: -1,
			deadzone: 0.01,
		},
		{
			physicalInput: "rightStickYUp",
			index: 4,
			event: "lookUp",
			sign: -1,
			deadzone: 0.01,
		},
		{
			physicalInput: "rightStickYDown",
			index: 4,
			event: "lookDown",
			sign: 1,
			deadzone: 0.01,
		},
	],
};

export const keyboardProfile = {
	id: "keyboard",
	buttons: [
		{
			physicalInput: "Spacebar",
			index: "Space",
			event: "jump",
		},
		{
			physicalInput: "A",
			index: "KeyA",
			event: "left",
		},
		{
			physicalInput: "D",
			index: "KeyD",
			event: "right",
		},
		{
			physicalInput: "W",
			index: "KeyW",
			event: "forward",
		},
		{
			physicalInput: "S",
			index: "KeyS",
			event: "backward",
		},
		{
			physicalInput: "1",
			index: "Digit1",
			event: "selectItem1",
		},
		{
			physicalInput: "2",
			index: "Digit2",
			event: "selectItem2",
		},
		{
			physicalInput: "3",
			index: "Digit3",
			event: "selectItem3",
		},
		{
			physicalInput: "4",
			index: "Digit4",
			event: "selectItem4",
		},
		{
			physicalInput: "5",
			index: "Digit5",
			event: "selectItem5",
		},
		{
			physicalInput: "6",
			index: "Digit6",
			event: "selectItem6",
		},
		{
			physicalInput: "7",
			index: "Digit7",
			event: "selectItem7",
		},
		{
			physicalInput: "8",
			index: "Digit8",
			event: "selectItem8",
		},
		{
			physicalInput: "9",
			index: "Digit9",
			event: "selectItem9",
		},
		{
			physicalInput: "E",
			index: "KeyE",
			event: "interact",
		},
		{
			physicalInput: "LeftArrow",
			index: "ArrowLeft",
			event: "left",
		},
		{
			physicalInput: "RightArrow",
			index: "ArrowRight",
			event: "right",
		},
		{
			physicalInput: "UpArrow",
			index: "ArrowUp",
			event: "forward",
		},
		{
			physicalInput: "DownArrow",
			index: "ArrowDown",
			event: "backward",
		},
	],
};
