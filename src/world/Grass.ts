import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three";
//@ts-ignore
import grassFragment from "@shaders/grass/fragment.glsl";
//@ts-ignore
import grassVertex from "@shaders/grass/vertex.glsl";
//@ts-ignore
import grassVertexDeclarations from "@shaders/grass/vertexDeclarations.glsl";
//@ts-ignore
import grassFragmentDeclarations from "@shaders/grass/fragmentDeclarations.glsl";
//@ts-ignore
import grassVertexBeginNormal from "@shaders/grass/grassBeginNormalVertex.glsl";

export default class Grass implements LifeTimeObject {
	declare private experience: Experience;
	declare private debugFolder: GUI;
	declare private gridDebugger: THREE.GridHelper;
	declare private material: THREE.MeshStandardMaterial;
	declare private depthMaterial: THREE.MeshDepthMaterial;
	declare private geometry: THREE.InstancedBufferGeometry;
	declare private mesh: THREE.Mesh;

	declare private grassMap: THREE.Texture;
	declare private grassAlphaMap: THREE.Texture;
	private grassFieldSizes = { x: 10, y: 10 };
	public heightRandomness = 1;

	private uniforms = {
		uTime: { value: 0 },
		uWindStrength: { value: 0.118 },
		uWindFrequency: { value: 0.0006 },
		uWindScale: { value: 0.18 },
		uCameraPosition: { value: new THREE.Vector3() },
		uGrassMapTexture: { value: new THREE.Texture() },
		uGrassAlphaMap: { value: new THREE.Texture() },
		uDarkFactor: { value: new THREE.Color(0xffffff) },
		uHeight: { value: 0.3 },
		uHeightRandomness: { value: 1 },
	};

	constructor() {
		if (!Experience.instance) return;

		this.experience = Experience.instance;

		if (this.experience?.debug.active) {
			this.debugFolder = this.experience?.debug.ui.addFolder("🌿 Grass");
		}
		this.setDebugObject();

		this.setGeometry();
		this.setMaterial();
		this.setMesh();
	}

	setGeometry() {
		const count = 10000;

		//prettier-ignore
		const positions = new Float32Array([
			0.5, -0.5, 0,
			-0.5, -0.5, 0,
			-0.5, 0.5, 0,
			0.5, 0.5, 0
		]);
		//prettier-ignore
		const indexs = [0, 1, 2, 2, 3, 0];
		//prettier-ignore
		const uvs = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0];
		// //prettier-ignore
		const normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

		const globalPositions = new Float32Array(3 * count);

		const fieldWidth = this.grassFieldSizes.x;
		const fieldDepth = this.grassFieldSizes.y;
		const fieldHeight = 0;

		for (let i = 0; i < count; i++) {
			const i3 = i * 3;

			const posX = Math.random() * fieldWidth - fieldWidth * 0.5;
			const posY = fieldHeight;
			const posZ = Math.random() * fieldDepth - fieldDepth * 0.5;
			globalPositions[i3] = posX;
			globalPositions[i3 + 1] = posY;
			globalPositions[i3 + 2] = posZ;
		}

		this.geometry = new THREE.InstancedBufferGeometry();
		this.geometry.instanceCount = count;
		this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
		this.geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
		this.geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
		this.geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indexs), 1));
		this.geometry.setAttribute(
			"aGlobalPosition",
			new THREE.InstancedBufferAttribute(globalPositions, 3)
		);
	}

	setMaterial() {
		const colorTexture = this.experience.resources.items["grassColorTexture"] as THREE.Texture;
		colorTexture.colorSpace = THREE.SRGBColorSpace;
		this.uniforms.uGrassMapTexture.value = colorTexture;
		this.uniforms.uGrassAlphaMap.value = this.experience.resources.items[
			"grassAlphaTexture"
		] as THREE.Texture;
		//
		this.depthMaterial = new THREE.MeshDepthMaterial({
			depthPacking: THREE.RGBADepthPacking,
			side: THREE.BackSide,
		});

		this.material = new THREE.MeshStandardMaterial({
			side: THREE.BackSide,
		});

		this.material.onBeforeCompile = (shader) => {
			shader.uniforms.uTime = this.uniforms.uTime;
			shader.uniforms.uWindStrength = this.uniforms.uWindStrength;
			shader.uniforms.uWindFrequency = this.uniforms.uWindFrequency;
			shader.uniforms.uWindScale = this.uniforms.uWindScale;
			shader.uniforms.uCameraPosition = this.uniforms.uCameraPosition;
			shader.uniforms.uGrassMapTexture = this.uniforms.uGrassMapTexture;
			shader.uniforms.uGrassAlphaMap = this.uniforms.uGrassAlphaMap;
			shader.uniforms.uDarkFactor = this.uniforms.uDarkFactor;
			shader.uniforms.uHeight = this.uniforms.uHeight;
			shader.uniforms.uHeightRandomness = this.uniforms.uHeightRandomness;

			shader.vertexShader = shader.vertexShader.replace(
				"#include <common>",
				`
				  #include <common>
          ${grassVertexDeclarations}
        `
			);

			shader.vertexShader = shader.vertexShader.replace(
				"#include <defaultnormal_vertex>",
				`
		      #include <defaultnormal_vertex>
					${grassVertexBeginNormal}
        `
			);

			shader.vertexShader = shader.vertexShader.replace(
				"#include <begin_vertex>",
				`
		      #include <begin_vertex>
          ${grassVertex}
        `
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				"#include <common>",
				`
			      #include <common>
			      ${grassFragmentDeclarations}
			    `
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				"#include <map_fragment>",
				`
			    #include <map_fragment>
	        ${grassFragment}
	     `
			);
		};

		this.depthMaterial.onBeforeCompile = (shader) => {
			shader.uniforms.uTime = this.uniforms.uTime;
			shader.uniforms.uWindStrength = this.uniforms.uWindStrength;
			shader.uniforms.uWindFrequency = this.uniforms.uWindFrequency;
			shader.uniforms.uWindScale = this.uniforms.uWindScale;
			shader.uniforms.uCameraPosition = this.uniforms.uCameraPosition;
			shader.uniforms.uGrassMapTexture = this.uniforms.uGrassMapTexture;
			shader.uniforms.uGrassAlphaMap = this.uniforms.uGrassAlphaMap;
			shader.uniforms.uDarkFactor = this.uniforms.uDarkFactor;
			shader.uniforms.uHeight = this.uniforms.uHeight;

			shader.vertexShader = shader.vertexShader.replace(
				"#include <common>",
				`
		      #include <common>
          ${grassVertexDeclarations}
        `
			);

			shader.vertexShader = shader.vertexShader.replace(
				"#include <begin_vertex>",
				`
	        #include <begin_vertex>
          ${grassVertex}
        `
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				"#include <common>",
				`
          #include <common>
          varying vec2 vUv;
          uniform sampler2D uGrassAlphaMap;
	     `
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				"#include <alphatest_fragment>",
				`
          float alpha = texture2D(uGrassAlphaMap, vUv).r;
          if (alpha < 0.9) discard;
			  `
			);
		};
	}

	setMesh() {
		// const planeGeo = new THREE.PlaneGeometry(1, 1)
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.customDepthMaterial = this.depthMaterial;
		this.mesh.receiveShadow = true;
		this.mesh.frustumCulled = false;
		this.experience.scene.add(this.mesh);
	}

	init = () => {};
	destroy = () => {};
	update = () => {
		if (!Experience.instance) return;
		this.uniforms.uCameraPosition.value.copy(this.experience.camera.instance.position);
		this.uniforms.uTime.value = Experience.instance?.time.elapsed;
	};

	setDebugObject = () => {
		if (!this.experience?.debug.active) return;

		this.gridDebugger = new THREE.GridHelper(this.grassFieldSizes.x, this.grassFieldSizes.y);
		this.gridDebugger.layers.set(2);
		this.experience.scene.add(this.gridDebugger);

		this.debugFolder
			.add(this.uniforms.uWindStrength, "value")
			.min(0.01)
			.max(1)
			.step(0.001)
			.name("wind strength");
		this.debugFolder
			.add(this.uniforms.uWindFrequency, "value")
			.min(0.0001)
			.max(0.01)
			.step(0.0001)
			.name("wind frequency");
		this.debugFolder
			.add(this.uniforms.uWindScale, "value")
			.min(0.01)
			.max(2)
			.step(0.01)
			.name("wind scale");
		this.debugFolder
			.add(this.uniforms.uHeight, "value")
			.min(0.01)
			.max(2)
			.step(0.01)
			.name("grass height");
		this.debugFolder
			.add(this.uniforms.uHeightRandomness, "value")
			.min(0)
			.max(2)
			.step(0.01)
			.name("grass height randomness");
	};
}
