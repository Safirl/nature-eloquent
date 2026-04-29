/**
 * Implementation of https://github.com/mrdoob/three.js/blob/master/examples/misc_controls_pointerlock.html
 */

import { Experience } from "@plugins/baseExperience";
import { Camera } from "@plugins/baseExperience";
import { type InputEventArgs } from "@plugins/baseExperience/inputs/inputInterfaces";
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";

export default class FirstPersonCamera extends Camera {
	declare controls: PointerLockControls;

	//Movements
	declare moveForward: boolean;
	declare moveBackward: boolean;
	declare moveLeft: boolean;
	declare moveRight: boolean;
	declare canJump: boolean;

	declare velocity: THREE.Vector3;
	declare direction: THREE.Vector3;
	declare speed: number;
	declare friction: number;
	declare mass: number;

	constructor() {
		super();
		this.moveBackward = false;
		this.moveForward = false;
		this.moveLeft = false;
		this.moveRight = false;
		this.canJump = false;

		this.velocity = new THREE.Vector3();
		this.direction = new THREE.Vector3();
		this.speed = 3;
		this.friction = 200;
	}

	init(): void {
		super.init();
	}

	setInstance(): void {
		this.instance = new THREE.PerspectiveCamera(
			35,
			this.sizes.width / this.sizes.height,
			0.1,
			1000
		);
		this.instance.position.set(0, 1, 10);
		super.setInstance();
	}

	setControls() {
		this.controls = new PointerLockControls(this.instance, document.body);
		Experience.instance?.canvas.addEventListener("click", () => {
			this.controls.lock();
		});
		this.bindInputs();
	}

	bindInputs() {
		Experience.instance?.inputSystem.on(
			"forward",
			(args: InputEventArgs) => {
				if (args.type === "pressed") {
					this.moveForward = true;
				} else if (args.type === "released") {
					this.moveForward = false;
				}
			}
		);
		Experience.instance?.inputSystem.on(
			"backward",
			(args: InputEventArgs) => {
				if (args.type === "pressed") {
					this.moveBackward = true;
				} else if (args.type === "released") {
					this.moveBackward = false;
				}
			}
		);
		Experience.instance?.inputSystem.on("left", (args: InputEventArgs) => {
			if (args.type === "pressed") {
				this.moveLeft = true;
			} else if (args.type === "released") {
				this.moveLeft = false;
			}
		});
		Experience.instance?.inputSystem.on("right", (args: InputEventArgs) => {
			if (args.type === "pressed") {
				this.moveRight = true;
			} else if (args.type === "released") {
				this.moveRight = false;
			}
		});
	}

	resize(): void {
		super.resize();
	}

	destroy(): void {
		this.controls.dispose();
	}

	update(): void {
		if (!Experience.instance) {
			return;
		}

		if (this.controls.isLocked === false) {
			return;
		}
		const damping = Math.exp(
			(-this.friction * Experience.instance.time.delta) / 10000
		);

		this.velocity.x *= damping;
		this.velocity.z *= damping;

		this.applyGravity();

		this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
		this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
		this.direction.normalize();

		if (this.moveForward || this.moveBackward) {
			this.velocity.z -=
				(this.direction.z *
					this.speed *
					Experience.instance.time.delta) /
				10000;
		}
		if (this.moveLeft || this.moveRight)
			this.velocity.x -=
				(this.direction.x *
					this.speed *
					Experience.instance.time.delta) /
				10000;

		//Implement here collisions

		this.controls.moveRight(
			-this.velocity.x * Experience.instance.time.delta
		);
		this.controls.moveForward(
			-this.velocity.z * Experience.instance.time.delta
		);
	}

	/**
	 * Called when calculating movements from inputs. Override to add a custom gravity or change the mass variable.
	 */
	applyGravity(): void {
		if (!Experience.instance) {
			return;
		}

		this.velocity.y -= 9.8 * this.mass * Experience.instance.time.delta;
	}

	setDebugObject(): void {
		if (!this.debug.active) {
			return;
		}
		super.setDebugObject();

		const movementsFolder = this.debugFolder.addFolder("movements");

		movementsFolder
			.add(this, "speed")
			.name("speed")
			.min(1)
			.max(100)
			.step(0.1);
		movementsFolder
			.add(this, "friction")
			.name("friction")
			.min(1)
			.max(800)
			.step(0.1);
	}
}
