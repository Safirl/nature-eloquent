import type MenuState from "./MenuState";
import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import * as THREE from "three"
import { plane, type GLTF } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import type FirstPersonCameraOctree from "@plugins/firstPersonCamera/camera/FirstPersonCameraOctree";

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
	private experience: Experience;
	private scene: THREE.Scene;
	private declare herbium: THREE.Group;
	private readonly localOffset = new THREE.Vector3(0, -0.275, -0.25);
	private readonly baseRotation = new THREE.Quaternion().setFromAxisAngle(
		new THREE.Vector3(0.1, 1, -0.1),
		-90 * Math.PI / 180
	);
	private declare holder: THREE.Object3D
	private stickers = [] as THREE.Mesh[]
	private stickersProgress = [] as number[]
	private activeIndex: number = -1
	private walkIntensity: number = 0
	private readonly _shakeVec = new THREE.Vector3()
	private readonly _shakeTilt = new THREE.Quaternion()
	private readonly _shakeTiltAxis = new THREE.Vector3(0, 0, 1)


	params = {
		progress: 0,
		amplitude: 0.015,
		frequency: 8,
		anchor1: 0.2,
		anchor2: 0.4,
	}

	private uniforms = [] as any;

	constructor(state: MenuState, containerId: string) {
		this.state = state;

		if (!Experience.instance)
			throw new Error("Menu: Experience is not initialized");

		this.experience = Experience.instance;
		this.scene = this.experience.scene


		const container = document.getElementById(containerId);
		if (!container)
			throw new Error(
				`MenuView: container "${containerId}" not found`
			);
		this.container = container;

		this.state.on("itemListChanged.menuView", this.onItemListChanged);
		this.state.on("currentItemChanged.menuView", this.onCurrentItemChanged);

		this.init()
		this.createTweak()
	}

	private onItemListChanged = () => this.render();
	private onCurrentItemChanged = () => this.updateActive();


	init() {
		this.holder = new THREE.Object3D()
		this.herbium = (this.experience.resources.items.herbarium as GLTF).scene
		this.herbium.traverse(obj => {
			if (obj.name === "pages") {
				obj.receiveShadow = true
			}
		})
		this.holder.add(this.herbium)
		this.scene.add(this.holder)
	}

	update() {
		const camera = this.experience.camera.instance;
		const worldOffset = this.localOffset.clone().applyQuaternion(camera.quaternion);
		this.holder.position.copy(camera.position).add(worldOffset);
		this.holder.quaternion.copy(camera.quaternion).multiply(this.baseRotation);




		const controller = this.experience.camera as unknown as FirstPersonCameraOctree;
		const vel = controller.velocity;
		const horizontalSpeed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
		const targetIntensity = Math.min(horizontalSpeed / 8, 1);
		this.walkIntensity += (targetIntensity - this.walkIntensity) * 0.08;

		const t = this.experience.time.elapsed / 1000;

		// Idle
		const idleStrength = 1 - this.walkIntensity;
		this._shakeVec.set(0, Math.sin(t * 1.2) * 0.003 * idleStrength, 0)
			.applyQuaternion(camera.quaternion);
		this.holder.position.add(this._shakeVec);


		// Struggle
		if (this.walkIntensity > 0.001) {
			const amp = 0.005 * this.walkIntensity;

			this._shakeVec.set(
				Math.sin(t * 11) * amp,
				Math.abs(Math.sin(t * 5.5)) * amp * 0.6,
				0
			).applyQuaternion(camera.quaternion);
			this.holder.position.add(this._shakeVec);

			this._shakeTilt.setFromAxisAngle(
				this._shakeTiltAxis,
				Math.sin(t * 11) * 0.025 * this.walkIntensity
			);
			this.holder.quaternion.multiply(this._shakeTilt);
		}
	}




	createStickerMaterial(texture: THREE.Texture) {
		const material = new THREE.MeshStandardMaterial({
			map: texture,
			transparent: true,
			side: THREE.DoubleSide,
		});

		this.uniforms.push({
			uTexture: { value: texture },
			uProgress: { value: 0 },
			uAmplitude: { value: this.params.amplitude },
			uFrequency: { value: this.params.frequency },
			uAnchor1: { value: this.params.anchor1 },
			uAnchor2: { value: this.params.anchor2 },
			uDirection: { value: 1 }
		});

		const index = this.uniforms.length - 1;

		material.onBeforeCompile = (shader) => {
			Object.assign(shader.uniforms, this.uniforms[index]);

			shader.vertexShader = shader.vertexShader.replace(
				'#include <common>',
				`
				#include <common>
				uniform float uAmplitude;
				uniform float uFrequency;
				uniform float uProgress;
				uniform float uAnchor1;
				uniform float uAnchor2;
				uniform float uDirection;

				varying vec2 vUv;
				`
			);

			shader.vertexShader = shader.vertexShader.replace(
				'	#include <uv_vertex>',
				`
					#include <uv_vertex>
					vUv = uv;
				`
			);

			shader.vertexShader = shader.vertexShader.replace(
				'#include <begin_vertex>',
				`
				#include <begin_vertex>

				float lift = uProgress * uAmplitude;
				float waveEnvelope = sin(uProgress * 3.14159);

				float wave = uDirection * sin(vUv.y * uFrequency) * uAmplitude * uAnchor1 * waveEnvelope;
				float lateralWave = uDirection * sin(vUv.y * uFrequency * 0.7 + vUv.y * 3.14159)
					* uAmplitude * uAnchor2 * waveEnvelope;

				transformed.z += lift + wave;
				transformed.x += lateralWave;
				`
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <map_pars_fragment>',
				`
				#include <map_pars_fragment>
				uniform sampler2D uTexture;
				varying vec2 vUv;
				`
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				'#include <map_fragment>',
				`
				vec4 texelColor = texture2D(uTexture, vUv);
				diffuseColor *= texelColor;
				`
			);
		};

		return material;
	}


	private render() {

		const listToDisplay = this.state.getItemList()
		const herbariumPosition = new THREE.Vector3()
		herbariumPosition.copy(this.herbium.position)

		const stickerWidth = 0.04

		const stickerGeometry = new THREE.PlaneGeometry(stickerWidth, stickerWidth, 64, 64);

		const startingPos = this.herbium.children[1].geometry.boundingBox.max.y + stickerWidth
		const gap = 0.01

		let i = 0
		let pageIndex = 0

		for (const el of listToDisplay) {

			const stickerMaterial = this.createStickerMaterial(this.experience.resources.items[el.vignet] as THREE.Texture)


			const sticker = new THREE.Mesh(
				stickerGeometry,
				stickerMaterial,
			)
			sticker.castShadow = true

			sticker.position.set(
				herbariumPosition.x,
				herbariumPosition.y + 0.112,
				herbariumPosition.z
				+ startingPos
				- (i * gap + i * stickerWidth)
				- (pageIndex === 1 ? 0.095 : 0),
			)

			sticker.rotation.y = Math.PI / 2

			this.holder.add(sticker)
			this.stickers.push(sticker)
			this.stickersProgress.push(0)



			i++
			pageIndex = i > 2 ? 1 : 0
		}
	}


	private createTweak() {
		if (this.experience.debug.active) {
			const debugFolder = this.experience.debug.ui.addFolder("sticker");
			debugFolder.add(this.params, "progress", 0, 1, 0.01).onChange((v: number) => {
				this.stickers.map((s, i) => {
					this.uniforms[i].uProgress.value = v;
				})
			})
			debugFolder.add(this.params, "amplitude", 0, 0.1, 0.001).onChange((v: number) => {
				this.stickers.map((s, i) => {
					this.uniforms[i].uAmplitude.value = v;
				})
			})
			debugFolder.add(this.params, "frequency", 0, 50, 0.1).onChange((v: number) => {
				this.stickers.map((s, i) => {
					this.uniforms[i].uFrequency.value = v;
				})
			})
			debugFolder.add(this.params, "anchor1", 0, 1, 0.01).onChange((v: number) => {
				this.stickers.map((s, i) => {
					this.uniforms[i].uAnchor1.value = v;
				})
			})
			debugFolder.add(this.params, "anchor2", 0, 1, 0.01).onChange((v: number) => {
				this.stickers.map((s, i) => {
					this.uniforms[i].uAnchor2.value = v;
				})
			})


		}
	}

	private updateActive() {

		const resetStickers = () => {
			let i = -1

			for (const _el of this.stickers) {
				i++
				if (i !== this.activeIndex)
					gsap.to(this.uniforms[i].uProgress, {
						value: 0,
						duration: 0.3,
						ease: "sine.inOut",
					})

				this.uniforms[i].uDirection.value = -1;
			}
		}

		this.activeIndex = this.state.getItemList().findIndex(el => el.id === this.state.getCurrentItemId())


		if (this.activeIndex === -1) return resetStickers()

		const selectedSticker = this.stickers[this.activeIndex]

		if (!selectedSticker) return


		resetStickers()
		this.uniforms[this.activeIndex].uDirection.value = 1;

		gsap.to(this.uniforms[this.activeIndex].uProgress, {
			value: 1,
			duration: 0.3,
			ease: "sine.inOut",
		})
	}

	destroy() {
		this.state.off(".menuView");
		this.container.innerHTML = "";
		this.buttons = [];
	}
}
