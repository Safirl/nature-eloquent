import Experience from "@plugins/baseExperience/experience/Experience";
import Camera from "@plugins/baseExperience/experience/Camera";
import { type InputEventArgs } from "@plugins/baseExperience/inputs/inputInterfaces";
import * as THREE from "three";
import { Capsule } from "three/examples/jsm/Addons.js";
import GameExperience from "../../../GameExperience";

export default class FirstPersonCameraOctree extends Camera {
	declare moveForward: boolean;
	declare moveBackward: boolean;
	declare moveLeft: boolean;
	declare moveRight: boolean;
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

	constructor(height = 1.2, speed = 40, mass = 50, friction = 10) {
		super();

		// Mouvements
		this.moveBackward = false;
		this.moveForward = false;
		this.moveLeft = false;
		this.moveRight = false;
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
			100
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
			this.gameExperience = GameExperience.instance as GameExperience;
			Experience.instance.inputSystem.on("forward", (args: InputEventArgs) => {
				if (args.type === "pressed") {
					this.moveForward = true;
					this.playFootStepAudio()
				} else if (args.type === "released") {
					this.moveForward = false;
				}
			});
			Experience.instance.inputSystem.on("backward", (args: InputEventArgs) => {
				if (args.type === "pressed") {
					this.moveBackward = true;
					this.playFootStepAudio()
				} else if (args.type === "released") {
					this.moveBackward = false;
				}
			});
			Experience.instance.inputSystem.on("left", (args: InputEventArgs) => {
				if (args.type === "pressed") {
					this.moveLeft = true;
					this.playFootStepAudio()
				} else if (args.type === "released") {
					this.moveLeft = false;
				}
			});
			Experience.instance.inputSystem.on("right", (args: InputEventArgs) => {
				if (args.type === "pressed") {
					this.moveRight = true;
					this.playFootStepAudio()
				} else if (args.type === "released") {
					this.moveRight = false;
				}
			});
			Experience.instance.inputSystem.on("jump", (args: InputEventArgs) => {
				if (args.type === "pressed" && this.canJump) {
					this.velocity.y = 15;
				}
			});
		} else {
			throw new Error("Experience instance is not defined");
		}
	}

	async playFootStepAudio() {
		if (this.isPlayingFootstep) return;
		this.isPlayingFootstep = true;
		await this.gameExperience.audio2DManager.playFootStepAudio("/audio/soundEffects/grassWalk.mp3", 0.4);
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

		if (this.moveForward) this.velocity.add(this.getForwardVector().multiplyScalar(speedDelta));
		if (this.moveBackward)
			this.velocity.add(this.getForwardVector().multiplyScalar(-speedDelta));
		if (this.moveLeft) this.velocity.add(this.getSideVector().multiplyScalar(-speedDelta));
		if (this.moveRight) this.velocity.add(this.getSideVector().multiplyScalar(speedDelta));
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
