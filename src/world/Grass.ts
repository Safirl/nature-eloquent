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

	private chunkGeometries: THREE.InstancedBufferGeometry[] = [];
	public meshes: THREE.Mesh[] = [];

	/** Backward-compat accessor for single-chunk grass (e.g. Introduction) */
	get mesh(): THREE.Mesh {
		return this.meshes[0];
	}

	declare private grassMap: THREE.Texture;
	declare private grassAlphaMap: THREE.Texture;
	private grassFieldSizes = { x: 100, y: 100 };
	public heightRandomness = 1;
	private count: number = 10000000;
	private chunkSize = 10;

	public uniforms = {
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
		uRenderDistance: { value: 100 },
	};

	constructor(count?: number, fieldSizeX?: number, fieldSizeZ?: number) {
		if (!Experience.instance) return;

		this.experience = Experience.instance;

		if (this.experience?.debug.active) {
			this.debugFolder = this.experience?.debug.ui.addFolder("🌿 Grass");
		}
		if (count) {
			this.count = count;
		}
		if (fieldSizeX) {
			this.grassFieldSizes.x = fieldSizeX;
		}
		if (fieldSizeZ) {
			this.grassFieldSizes.y = fieldSizeZ;
		}
		this.setDebugObject();

		this.setGeometry();
		this.setMaterial();
		this.setMesh();
	}

	setGeometry() {
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
		const normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];

		const fieldWidth = this.grassFieldSizes.x;
		const fieldDepth = this.grassFieldSizes.y;
		const chunkCols = Math.ceil(fieldWidth / this.chunkSize);
		const chunkRows = Math.ceil(fieldDepth / this.chunkSize);
		const bladesPerChunk = Math.ceil(this.count / (chunkCols * chunkRows));

		for (let row = 0; row < chunkRows; row++) {
			for (let col = 0; col < chunkCols; col++) {
				const chunkX = col * this.chunkSize - fieldWidth / 2;
				const chunkZ = row * this.chunkSize - fieldDepth / 2;

				const globalPositions = new Float32Array(3 * bladesPerChunk);
				for (let i = 0; i < bladesPerChunk; i++) {
					globalPositions[i * 3] = chunkX + Math.random() * this.chunkSize;
					globalPositions[i * 3 + 1] = 0;
					globalPositions[i * 3 + 2] = chunkZ + Math.random() * this.chunkSize;
				}

				const geo = new THREE.InstancedBufferGeometry();
				geo.instanceCount = bladesPerChunk;
				geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
				geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
				geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
				geo.setIndex(new THREE.BufferAttribute(new Uint16Array(indexs), 1));
				geo.setAttribute(
					"aGlobalPosition",
					new THREE.InstancedBufferAttribute(globalPositions, 3)
				);

				// Bounding sphere fitted to the actual chunk data extent
				const actualEndX = Math.min(chunkX + this.chunkSize, fieldWidth / 2);
				const actualEndZ = Math.min(chunkZ + this.chunkSize, fieldDepth / 2);
				const cx = (chunkX + actualEndX) / 2;
				const cz = (chunkZ + actualEndZ) / 2;
				const halfW = (actualEndX - chunkX) / 2;
				const halfD = (actualEndZ - chunkZ) / 2;
				geo.boundingSphere = new THREE.Sphere(
					new THREE.Vector3(cx, 0, cz),
					Math.sqrt(halfW * halfW + halfD * halfD) + 2
				);

				this.chunkGeometries.push(geo);
			}
		}
	}

	setMaterial() {
		const colorTexture = this.experience.resources.items["grassColorTexture"] as THREE.Texture;
		colorTexture.colorSpace = THREE.SRGBColorSpace;
		this.uniforms.uGrassMapTexture.value = colorTexture;
		this.uniforms.uGrassAlphaMap.value = this.experience.resources.items[
			"grassAlphaTexture"
		] as THREE.Texture;

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
			shader.uniforms.uRenderDistance = this.uniforms.uRenderDistance;

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
			shader.uniforms.uHeightRandomness = this.uniforms.uHeightRandomness;
			shader.uniforms.uRenderDistance = this.uniforms.uRenderDistance;

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
		for (const geo of this.chunkGeometries) {
			const mesh = new THREE.Mesh(geo, this.material);
			mesh.customDepthMaterial = this.depthMaterial;
			mesh.receiveShadow = true;
			this.experience.scene.add(mesh);
			this.meshes.push(mesh);
		}
	}

	/**
	 * Samples terrain heights on a grid and applies them to all blade positions.
	 * Call this after the terrain model's world matrix is up to date.
	 */
	setTerrain(terrainObject: THREE.Object3D, gridResolution: number = 1): void {
		const fieldW = this.grassFieldSizes.x;
		const fieldD = this.grassFieldSizes.y;
		const originX = -fieldW / 2;
		const originZ = -fieldD / 2;

		const cols = Math.ceil(fieldW / gridResolution) + 1;
		const rows = Math.ceil(fieldD / gridResolution) + 1;
		const heightGrid = new Float32Array(cols * rows);

		const terrainMeshes: THREE.Mesh[] = [];
		terrainObject.updateMatrixWorld(true);
		terrainObject.traverse((child) => {
			if (child instanceof THREE.Mesh) terrainMeshes.push(child);
		});

		const raycaster = new THREE.Raycaster();
		raycaster.ray.direction.set(0, -1, 0);

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				raycaster.ray.origin.set(
					originX + col * gridResolution,
					100,
					originZ + row * gridResolution
				);
				const hits = raycaster.intersectObjects(terrainMeshes, false);
				heightGrid[row * cols + col] = hits.length > 0 ? hits[0].point.y : 0;
			}
		}

		for (const geo of this.chunkGeometries) {
			const attr = geo.getAttribute("aGlobalPosition") as THREE.InstancedBufferAttribute;
			const count = attr.count;

			for (let i = 0; i < count; i++) {
				const x = attr.getX(i);
				const z = attr.getZ(i);

				const fx = (x - originX) / gridResolution;
				const fz = (z - originZ) / gridResolution;
				const col0 = Math.max(0, Math.min(cols - 2, Math.floor(fx)));
				const row0 = Math.max(0, Math.min(rows - 2, Math.floor(fz)));
				const tx = fx - col0;
				const tz = fz - row0;

				const h00 = heightGrid[row0 * cols + col0];
				const h10 = heightGrid[row0 * cols + (col0 + 1)];
				const h01 = heightGrid[(row0 + 1) * cols + col0];
				const h11 = heightGrid[(row0 + 1) * cols + (col0 + 1)];

				const height =
					(h00 * (1 - tx) + h10 * tx) * (1 - tz) + (h01 * (1 - tx) + h11 * tx) * tz;
				attr.setY(i, height);
			}

			attr.needsUpdate = true;
		}
	}

	init = () => {};

	destroy = () => {
		for (const mesh of this.meshes) {
			this.experience.scene.remove(mesh);
		}
		for (const geo of this.chunkGeometries) {
			geo.dispose();
		}
		this.material.dispose();
		this.depthMaterial.dispose();
	};

	update = () => {
		if (!Experience.instance) return;
		const camPos = this.experience.camera.instance.position;
		this.uniforms.uCameraPosition.value.copy(camPos);
		this.uniforms.uTime.value = Experience.instance.time.elapsed;
console.log(this.uniforms.uRenderDistance.value);
		const renderDist = this.uniforms.uRenderDistance.value;
		const cutoffSq = (renderDist + this.chunkSize) ** 2;

		const radius = this.uniforms.uRenderDistance.value;
		for (const mesh of this.meshes) {
			const sphere = (mesh.geometry as THREE.InstancedBufferGeometry).boundingSphere!;
			const dx = sphere.center.x - camPos.x;
			const dz = sphere.center.z - camPos.z;
			// mesh.visible = dx * dx + dz * dz < cutoffSq;
			mesh.visible = sphere.center.distanceToSquared(camPos) < radius * radius;
		}



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
		this.debugFolder
			.add(this.uniforms.uRenderDistance, "value")
			.min(5)
			.max(1000)
			.step(1)
			.name("render distance");
	};
}
