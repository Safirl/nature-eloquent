import Experience from "@plugins/baseExperience/experience/Experience";
import Camera from "@plugins/baseExperience/experience/Camera";
import { type InputEventArgs } from "@plugins/baseExperience/inputs/inputInterfaces";
import * as THREE from "three";
import { Capsule } from "three/examples/jsm/Addons.js";
import GameExperience from "../../../GameExperience";

export default class FirstPersonCameraOctree extends Camera {
	declare moveForward: number;
	declare moveBackward: number;
	declare moveLeft: number;
	declare moveRight: number;
	declare canJump: boolean;

	declare playerCollider: Capsule;
	declare playerBox: THREE.Box3;

	declare velocity: THREE.Vector3;
	declare direction: THREE.Vector3;

	declare friction: number;
	declare height: number;
	declare speed: number;
	declare mass: number;
	declare delta: number;
	declare maxPitch: number;
	public enable = true;

	declare gameExperience: GameExperience;
	declare isPlayingFootstep: boolean;
	public jumpForce: number = 8;
	private lastInputSource: "keyboard" | "gamepad" = "keyboard";

	constructor(height = 1.7, speed = 40, mass = 50, friction = 10) {
		super();

		// Mouvements
		this.moveBackward = 0;
		this.moveForward = 0;
		this.moveLeft = 0;
		this.moveRight = 0;
		this.canJump = false;

		// Collision
		this.canJump = false;

		this.velocity = new THREE.Vector3();
		this.direction = new THREE.Vector3();

		// Params
		this.height = height;
		this.speed = speed;
		this.mass = mass;
		this.friction = friction;
		this.maxPitch = Math.PI / 2 - 0.01;

		this.playerCollider = new Capsule(
			new THREE.Vector3(0, 0.35, 0),
			new THREE.Vector3(0, this.height, 0),
			0.35
		);
		this.playerBox = new THREE.Box3();
		// Test bug player
		// this.playerCollider.translate(new THREE.Vector3(0, 10, 0));
	}

	// Création de la camra
	setInstance(): void {
		this.instance = new THREE.PerspectiveCamera(
			70,
			this.sizes.width / this.sizes.height,
			0.1,
			300
		);
		this.instance.rotation.order = "YXZ";
		super.setInstance();
	}

	setControls() {
		Experience.instance?.canvas.addEventListener("mousedown", this.lockPointer);

		Experience.instance?.canvas.addEventListener("mousemove", (e: MouseEvent) => {
			if (!this.enable) return;
			if (document.pointerLockElement === Experience.instance?.canvas) {
				this.instance.rotation.y -= e.movementX / 500;
				this.instance.rotation.x -= e.movementY / 500;
				this.instance.rotation.x = THREE.MathUtils.clamp(
					this.instance.rotation.x,
					-this.maxPitch,
					this.maxPitch
				);
			}
		});

		this.bindInputs();
	}

	lockPointer = () => {
		this.experience.canvas.requestPointerLock();
	};

	bindInputs() {
		if (Experience.instance) {
			Experience.instance.inputSystem.on(
				"horizontalMovement",
				(args: number) => {
					if (args === 0 && this.lastInputSource === "keyboard") {
						return;
					}
					// args positif = droite, négatif = gauche
					this.moveRight = Math.max(0, args);
					this.moveLeft = Math.max(0, -args);
				}
			);
			Experience.instance.inputSystem.on(
				"verticalMovement",
				(args: number) => {
					if (args === 0 && this.lastInputSource === "keyboard") {
						return;
					}
					// args négatif = forward (joystick vers le haut = axe négatif)
					this.moveForward = Math.max(0, -args);
					this.moveBackward = Math.max(0, args);
					if (args !== 0) {
						this.lastInputSource = "gamepad";
					}
				}
			);

			/* Movements */
			Experience.instance.inputSystem.on(
				"forward",
				(args: InputEventArgs) => {
					if (args.type === "pressed") {
						this.moveForward = 1;
					} else if (args.type === "released") {
						this.moveForward = 0;
					}
					this.lastInputSource = "keyboard";
				}
			);
			Experience.instance.inputSystem.on(
				"backward",
				(args: InputEventArgs) => {
					if (args.type === "pressed") {
						this.moveBackward = 1;
					} else if (args.type === "released") {
						this.moveBackward = 0;
					}
					this.lastInputSource = "keyboard";
				}
			);
			Experience.instance.inputSystem.on(
				"left",
				(args: InputEventArgs) => {
					if (args.type === "pressed") {
						this.moveLeft = 1;
					} else if (args.type === "released") {
						this.moveLeft = 0;
					}
					this.lastInputSource = "keyboard";
				}
			);
			Experience.instance.inputSystem.on(
				"right",
				(args: InputEventArgs) => {
					if (args.type === "pressed") {
						this.moveRight = 1;
					} else if (args.type === "released") {
						this.moveRight = 0;
					}
					this.lastInputSource = "keyboard";
				}
			});
			Experience.instance.inputSystem.on("jump", (args: InputEventArgs) => {
				if (args.type === "pressed" && this.canJump) {
					this.velocity.y = this.jumpForce;
				}
			});
		} else {
			throw new Error("Experience instance is not defined");
		}
	}

	async playFootStepAudio() {
		if (this.isPlayingFootstep) return;
		this.isPlayingFootstep = true;
		await this.gameExperience.audio2DManager.playFootStepAudio(
			"/audio/soundEffects/grassWalk.mp3",
			0.2
		);
		this.isPlayingFootstep = false;
	}

	// Direction de la caméra sur plan horizontal
	private getForwardVector(): THREE.Vector3 {
		this.instance.getWorldDirection(this.direction);
		this.direction.y = 0;
		this.direction.normalize();
		return this.direction;
	}

	private getSideVector(): THREE.Vector3 {
		this.instance.getWorldDirection(this.direction);
		this.direction.y = 0;
		this.direction.normalize();
		this.direction.cross(this.instance.up);
		return this.direction;
	}

	private applyControls(delta: number): void {
		const speedDelta = delta * (this.canJump ? this.speed : 8);

		this.velocity.add(
			this.getForwardVector()
				.multiplyScalar(speedDelta)
				.multiplyScalar(this.moveForward)
		);
		this.velocity.add(
			this.getForwardVector()
				.multiplyScalar(-speedDelta)
				.multiplyScalar(this.moveBackward)
		);
		this.velocity.add(
			this.getSideVector()
				.multiplyScalar(-speedDelta)
				.multiplyScalar(this.moveLeft)
		);
		this.velocity.add(
			this.getSideVector()
				.multiplyScalar(speedDelta)
				.multiplyScalar(this.moveRight)
		);
	}

	private updatePlayerCollisions(): void {
		const collisionManager = this.experience.collisionManager;
		if (!collisionManager) throw new Error("Experience instance is not defined");

		// position du joueur pour trigger
		// console.log("player position:", this.playerCollider.end);

		const result = collisionManager.worldOctree.capsuleIntersect(this.playerCollider);
		this.canJump = false;

		if (result) {
			this.canJump = result.normal.y > 0;

			if (!this.canJump) {
				// Annule la vitesse du joueur face à un mur
				this.velocity.addScaledVector(result.normal, -result.normal.dot(this.velocity));
			}
			if (result.depth >= 1e-10) {
				// En cas que le joueur traverse le mur
				this.playerCollider.translate(result.normal.multiplyScalar(result.depth));
			}
		}
	}

	teleportPlayer(newPosition: THREE.Vector3) {
		//{ x: 32.28367313757795, y: 1.19999999992237, z: -40.68886466113165 }
		this.playerCollider.translate(newPosition);
	}

	private updatePlayer(delta: number): void {
		let damping = Math.exp(-this.friction * delta) - 1;

		if (!this.canJump) {
			this.applyGravity();
			damping *= 0.1;
		}

		this.velocity.addScaledVector(this.velocity, damping);

		const soundVelocity = new THREE.Vector3(this.velocity.x, 0, this.velocity.z);
		if (soundVelocity.length() > 0.2) {
			this.playFootStepAudio();
		}

		// Fait bouger le player en fonction de sa vélocité
		const deltaPosition = this.velocity.clone().multiplyScalar(delta);
		this.playerCollider.translate(deltaPosition);

		this.updatePlayerCollisions();

		this.instance.position.copy(this.playerCollider.end);

		this.playerBox.setFromPoints([this.playerCollider.start, this.playerCollider.end]);
	}

	update(): void {
		if (!this.enable) return;
		if (!Experience.instance) {
			return;
		}
		if (!this.experience.areResourcesLoaded) return;
		// if (document.pointerLockElement !== Experience.instance.canvas) return;

		const delta = Experience.instance.time.delta / 1000;

		this.applyControls(delta);
		this.updatePlayer(delta);
	}

	resize(): void {
		super.resize();
	}

	destroy(): void {
		document.exitPointerLock();
	}

	/**
	 * Called when calculating movements from inputs. Override to add a custom gravity or change the mass variable.
	 */
	applyGravity(): void {
		if (!Experience.instance) {
			return;
		}
		this.velocity.y -= (9.8 * this.mass * Experience.instance.time.delta) / 10000;
	}

	setDebugObject(): void {
		if (!this.debug.active) {
			return;
		}
		super.setDebugObject();

		this.debugFolder
			.add(this.instance, "far")
			.min(0)
			.max(200)
			.step(0.1)
			.onChange(() => {
				this.instance.updateProjectionMatrix();
			});

		const movementsFolder = this.debugFolder.addFolder("movements");

		movementsFolder.add(this, "speed").name("speed").min(1).max(100).step(0.1);
		movementsFolder.add(this, "friction").name("friction").min(1).max(800).step(0.1);
		movementsFolder
			.add(this, "height")
			.name("height")
			.min(1)
			.max(5)
			.step(0.1)
			.onChange(() => {
				this.playerCollider.end.set(0, this.height, 0);
			});
	}
}
