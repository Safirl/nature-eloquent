import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import InteractableInstancedMesh from "./InteractableInstancedMesh";

export default class InstancedPlaceableManager implements LifeTimeObject {
	public count = 0;
	declare private max: number;
	declare private animationDuration: number;
	declare private experience: Experience;
	declare private sizeY: number;

	private meshInstances: InteractableInstancedMesh[] = [];
	private progressAttrs: THREE.InstancedBufferAttribute[] = [];
	private originYAttrs: THREE.InstancedBufferAttribute[] = [];
	declare private progressArray: Float32Array;
	declare private originYArray: Float32Array;
	private animatingCount = 0;
	private dummy = new THREE.Object3D();

	constructor(resource: GLTF, max = 100, animationDuration = 3) {
		if (!Experience.instance) return;
		this.experience = Experience.instance;
		this.max = max;
		this.animationDuration = animationDuration;
		this.progressArray = new Float32Array(max);
		this.originYArray = new Float32Array(max);

		const box = new THREE.Box3().setFromObject(resource.scene);
		const size = new THREE.Vector3();
		box.getSize(size);
		this.sizeY = size.y;

		resource.scene.updateWorldMatrix(true, true);
		resource.scene.traverse((child) => {
			if (!(child instanceof THREE.Mesh)) return;
			this.createInstancedMesh(child);
		});
	}

	private createInstancedMesh(child: THREE.Mesh) {
		const geometry = child.geometry.clone();
		const childWorldMatrix = child.matrixWorld.clone();

		const progressAttr = new THREE.InstancedBufferAttribute(
			this.progressArray,
			1
		);
		const originYAttr = new THREE.InstancedBufferAttribute(
			this.originYArray,
			1
		);
		geometry.setAttribute("aProgress", progressAttr);
		geometry.setAttribute("aOriginY", originYAttr);
		this.progressAttrs.push(progressAttr);
		this.originYAttrs.push(originYAttr);

		const sourceMaterial = Array.isArray(child.material)
			? child.material[0]
			: child.material;
		const material = (sourceMaterial as THREE.Material).clone();
		this.setupMaterial(material);

		const instancedMesh = new InteractableInstancedMesh(
			geometry,
			material,
			this.max
		);
		instancedMesh.count = 0;
		instancedMesh.castShadow = true;
		instancedMesh.receiveShadow = true;
		instancedMesh.frustumCulled = false;
		// Store the child-relative-to-root matrix for combined instance transforms
		(instancedMesh as any)._childWorldMatrix = childWorldMatrix;

		this.experience.scene.add(instancedMesh);
		this.meshInstances.push(instancedMesh);
	}

	private setupMaterial(material: THREE.Material) {
		const sizeY = this.sizeY;

		if (material instanceof THREE.MeshStandardMaterial) {
			const envMap = this.experience.world.environment.environmentMap;
			material.envMap = envMap.texture;
			material.envMapIntensity = envMap.intensity;
			material.needsUpdate = true;
		}

		material.transparent = true;
		material.depthWrite = true;

		material.alphaTest = 0.5;
		// material.depthWrite = true;

		material.onBeforeCompile = (shader) => {
			shader.uniforms.uSizeY = { value: sizeY };

			shader.vertexShader = shader.vertexShader.replace(
				"#include <common>",
				`
				#include <common>
				attribute float aProgress;
				attribute float aOriginY;
				varying float vProgress;
				varying float vOriginY;
				varying float vWorldY;
				`
			);

			shader.vertexShader = shader.vertexShader.replace(
				"#include <begin_vertex>",
				`
				#include <begin_vertex>
				vProgress = aProgress;
				vOriginY = aOriginY;
				#ifdef USE_INSTANCING
					vWorldY = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).y;
				#else
					vWorldY = (modelMatrix * vec4(transformed, 1.0)).y;
				#endif
				`
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				"#include <common>",
				`
				#include <common>
				uniform float uSizeY;
				varying float vProgress;
				varying float vOriginY;
				varying float vWorldY;
				`
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				"#include <map_fragment>",
				`
				#include <map_fragment>
				float heightRatio = (vWorldY - vOriginY) / uSizeY;
				float fadeSize = 0.8;
				float progress = vProgress * (1.0 + fadeSize);
				float alpha = smoothstep(0.0, fadeSize, progress - heightRatio);
				diffuseColor.a *= alpha;
				`
			);
		};
	}

	add(position: THREE.Vector3) {
		if (this.count >= this.max) {
			console.warn("maximum instances reached!");
			return;
		}

		const i = this.count;
		this.originYArray[i] = position.y;
		this.progressArray[i] = 0;

		this.dummy.position.copy(position);
		this.dummy.rotation.y = Math.random() * Math.PI * 2;
		this.dummy.updateMatrix();

		this.meshInstances.forEach((mesh) => {
			const childWorldMatrix = (mesh as any)
				._childWorldMatrix as THREE.Matrix4;
			const combined = new THREE.Matrix4().multiplyMatrices(
				this.dummy.matrix,
				childWorldMatrix
			);
			mesh.setMatrixAt(i, combined);
			mesh.count = i + 1;
			mesh.instanceMatrix.needsUpdate = true;
		});

		this.originYAttrs.forEach((attr) => {
			attr.needsUpdate = true;
		});

		this.count++;
		this.animatingCount++;

		const target = { value: 0 };
		gsap.to(target, {
			value: 1,
			duration: this.animationDuration,
			onUpdate: () => {
				this.progressArray[i] = target.value;
			},
			onComplete: () => {
				this.progressArray[i] = 1;
				this.animatingCount--;
			},
		});
	}

	init = () => { };

	update = () => {
		if (this.animatingCount > 0) {
			this.progressAttrs.forEach((attr) => {
				attr.needsUpdate = true;
			});
		}
	};

	destroy = () => {
		// this.meshInstances.forEach((mesh) => {
		// 	this.experience.scene.remove(mesh);
		// 	mesh.geometry.dispose();
		// 	if (Array.isArray(mesh.material)) {
		// 		mesh.material.forEach((m) => m.dispose());
		// 	} else {
		// 		mesh.material.dispose();
		// 	}
		// });
		// this.meshInstances = [];
	};
}
