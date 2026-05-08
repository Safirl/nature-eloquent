import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

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
import type { GLTF } from "three/examples/jsm/Addons.js";

export default class Grass implements LifeTimeObject {
	declare private experience: Experience;
	declare private debugFolder: GUI;
	declare private gridDebugger: THREE.GridHelper;
	declare private material: THREE.MeshStandardMaterial;
	declare private depthMaterial: THREE.MeshDepthMaterial;
	declare private geometry: THREE.InstancedBufferGeometry;
	declare public mesh: THREE.Mesh;

	declare private grassMap: THREE.Texture;
	declare private grassAlphaMap: THREE.Texture;
	declare private sampler: MeshSurfaceSampler
	private grassFieldSizes = { x: 10, y: 10 };
	public heightRandomness = 1;
	private count: number = 100000;
	private declare scene: THREE.Scene

	private geoMinX = 0 // init in createChunks
	private geoMaxX = 0 // init in createChunks
	private geoMinZ = 0 // init in createChunks
	private geoMaxZ = 0 // init in createChunks
	private geoLegnthX = 0 // init in createChunks
	private geoLegnthZ = 0 // init in createChunks
	private xChuncksAmount = 0 // init in createChunks
	private zChuncksAmount = 0 // init in createChunks

	private chunkSize = 10; // chunck width



	private chunks: Map<string, THREE.InstancedMesh> = new Map();

	private worldChunkRange = 10; // how many chunks in X/Z
	declare private grassGeometry: THREE.BufferGeometry
	declare private grassMaterial: any
	private grassCount = 1990000


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
	};

	constructor(count?: number, fieldSizeX?: number, fieldSizeZ?: number) {
		if (!Experience.instance) return;

		this.experience = Experience.instance;
		this.scene = this.experience.scene;

		this.setDebugObject();

		this.setGeometry();
		this.setMaterial();


		this.createChunks(((this.experience.resources.items.layoutModel as any).scene.children.find((el: any) => el.name == "Plane006") as any) as any)

	}


	setGeometry() {

		this.grassGeometry = ((this.experience.resources.items.grass_model_lods as GLTF).scene.children.find((ch: any) => ch.name === "GrassLOD00") as any).geometry

	}

	setMaterial() {
		this.grassMaterial = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			side: THREE.DoubleSide
		})

	}

	createChunks(grassSurface: THREE.Mesh) {
		const geometry = grassSurface.geometry.clone();
		geometry.computeBoundingBox();
		geometry.applyMatrix4(grassSurface.matrixWorld);

		// World-space mesh used for raycasting only — not added to the scene
		const gs = new THREE.Mesh(geometry);

		this.geoMinX = gs.geometry.boundingBox?.min.x || 0;
		this.geoMaxX = gs.geometry.boundingBox?.max.x || 0;
		this.geoMinZ = gs.geometry.boundingBox?.min.z || 0;
		this.geoMaxZ = gs.geometry.boundingBox?.max.z || 0;

		this.geoLegnthX = Math.abs(this.geoMinX) + Math.abs(this.geoMaxX);
		this.geoLegnthZ = Math.abs(this.geoMinZ) + Math.abs(this.geoMaxZ);

		this.xChuncksAmount = Math.floor(this.geoLegnthX / this.chunkSize);
		this.zChuncksAmount = Math.floor(this.geoLegnthZ / this.chunkSize);

		for (let x = 0; x <= this.xChuncksAmount; x++) {
			for (let z = 0; z <= this.zChuncksAmount; z++) {
				this.createSingleChunk(gs, x, z);
			}
		}
	}
	createSingleChunk(grassSurface: THREE.Mesh, chunkX: number, chunkZ: number) {
		const key = `${chunkX}_${chunkZ}`;
		const grassDensity = 70;

		const material = new THREE.MeshBasicMaterial({
			color: new THREE.Color(Math.random(), Math.random(), Math.random()),
			side: THREE.DoubleSide,
		});

		const mesh = new THREE.InstancedMesh(
			this.grassGeometry,
			material,
			grassDensity * grassDensity
		);

		const quaternion = new THREE.Quaternion();
		const scale = new THREE.Vector3(1, 1, 1);
		const matrix = new THREE.Matrix4();
		const yAxis = new THREE.Vector3(0, 1, 0);

		const offsetX = this.geoMinX + chunkX * this.chunkSize;
		const offsetZ = this.geoMinZ + chunkZ * this.chunkSize;

		const raycaster = new THREE.Raycaster();
		raycaster.ray.direction.set(0, -1, 0);

		let count = 0;
		for (let x = 0; x < grassDensity; x++) {
			for (let z = 0; z < grassDensity; z++) {
				const px = offsetX + (x / grassDensity) * this.chunkSize;
				const pz = offsetZ + (z / grassDensity) * this.chunkSize;

				raycaster.ray.origin.set(px, 100, pz);
				const hits = raycaster.intersectObject(grassSurface);

				if (hits.length === 0) continue;

				quaternion.setFromAxisAngle(yAxis, Math.random() * Math.PI * 2);
				matrix.compose(hits[0].point, quaternion, scale);
				mesh.setMatrixAt(count, matrix);
				count++;
			}
		}

		// Only blades that hit the surface are rendered
		mesh.count = count;
		mesh.instanceMatrix.needsUpdate = true;
		// Start hidden — updateChunks enables nearby chunks each frame
		mesh.visible = false;

		this.scene.add(mesh);
		this.chunks.set(key, mesh);
	}

	getChunkKey(x: number, z: number) {
		const cx = Math.floor(x / this.chunkSize);
		const cz = Math.floor(z / this.chunkSize);
		return `${cx}_${cz}`;
	}


	updateChunks(playerPos: THREE.Vector3) {
		const maxDist = 30;

		for (const [key, mesh] of this.chunks) {
			const [cx, cz] = key.split("_").map(Number);
			const chunkCenterX = this.geoMinX + (cx + 0.5) * this.chunkSize;
			const chunkCenterZ = this.geoMinZ + (cz + 0.5) * this.chunkSize;
			const dx = chunkCenterX - playerPos.x;
			const dz = chunkCenterZ - playerPos.z;
			mesh.visible = dx * dx + dz * dz <= maxDist * maxDist;
		}
	}

	init = () => { };
	destroy = () => {
		// this.mesh.geometry.dispose();
		// for (const key in this.mesh.material) {
		// 	const value = this.mesh.material[key];
		// 	if (value && typeof value.dispose === "function") {
		// 		value.dispose();
		// 	}
		// }
		// this.experience.scene.remove(this.mesh);
	};
	update = () => {
		if (!Experience.instance) return;

		const playerPos = this.experience.camera.instance.position;
		this.updateChunks(playerPos);
	};

	setDebugObject = () => {
		// if (!this.experience?.debug.active) return;

		// this.gridDebugger = new THREE.GridHelper(this.grassFieldSizes.x, this.grassFieldSizes.y);
		// this.gridDebugger.layers.set(2);
		// this.experience.scene.add(this.gridDebugger);

		// this.debugFolder
		// 	.add(this.uniforms.uWindStrength, "value")
		// 	.min(0.01)
		// 	.max(1)
		// 	.step(0.001)
		// 	.name("wind strength");
		// this.debugFolder
		// 	.add(this.uniforms.uWindFrequency, "value")
		// 	.min(0.0001)
		// 	.max(0.01)
		// 	.step(0.0001)
		// 	.name("wind frequency");
		// this.debugFolder
		// 	.add(this.uniforms.uWindScale, "value")
		// 	.min(0.01)
		// 	.max(2)
		// 	.step(0.01)
		// 	.name("wind scale");
		// this.debugFolder
		// 	.add(this.uniforms.uHeight, "value")
		// 	.min(0.01)
		// 	.max(2)
		// 	.step(0.01)
		// 	.name("grass height");
		// this.debugFolder
		// 	.add(this.uniforms.uHeightRandomness, "value")
		// 	.min(0)
		// 	.max(2)
		// 	.step(0.01)
		// 	.name("grass height randomness");
	};
}
