import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import type { GLTF } from "three/examples/jsm/Addons.js";
import { MeshBVH } from "three-mesh-bvh";

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
	public heightRandomness = 0.5;
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
		uHeight: { value: 0.01 },
		uHeightRandomness: { value: 0.5 },
		uTipColor1: { value: new THREE.Color("#5d713e") },
		uTipColor2: { value: new THREE.Color("#5d713e") },
		uBaseColor: { value: new THREE.Color("#313f1b") },
	};

	constructor(count?: number, fieldSizeX?: number, fieldSizeZ?: number) {
		if (!Experience.instance) return;

		this.experience = Experience.instance;
		this.scene = this.experience.scene;

		this.setDebugObject();

		this.setGeometry();
		this.setMaterial();


		this.createChunks(((this.experience.resources.items.forestModel as any).scene.children.find((el: any) => el.name == "floor_m") as any) as any)

	}


	setGeometry() {

		this.grassGeometry = ((this.experience.resources.items.grass_model_lods as GLTF).scene.children.find((ch: any) => ch.name === "GrassLOD00") as any).geometry

	}

	setMaterial() {
		const grassTexture = this.experience.resources.items.grass_texture as THREE.Texture;
		const noiseTexture = this.experience.resources.items.pelrin_noise as THREE.Texture;

		this.grassMaterial = new THREE.MeshLambertMaterial({
			side: THREE.DoubleSide,
			transparent: false,
			alphaTest: 0.1,
		});

		this.grassMaterial.onBeforeCompile = (shader: any) => {
			shader.uniforms.uTime = this.uniforms.uTime;
			shader.uniforms.uWindStrength = this.uniforms.uWindStrength;
			shader.uniforms.uWindFrequency = this.uniforms.uWindFrequency;
			shader.uniforms.uWindScale = this.uniforms.uWindScale;
			shader.uniforms.uGrassAlphaTexture = { value: grassTexture };
			shader.uniforms.uNoiseTexture = { value: noiseTexture };
			shader.uniforms.uNoiseScale = { value: 1.5 };
			shader.uniforms.uBaseColor = this.uniforms.uBaseColor
			shader.uniforms.uTipColor1 = this.uniforms.uTipColor1
			shader.uniforms.uTipColor2 = this.uniforms.uTipColor2

			shader.vertexShader = shader.vertexShader.replace(
				`#include <common>`,
				`#include <common>
				uniform float uTime;
				uniform float uWindStrength;
				uniform float uWindFrequency;
				uniform float uWindScale;
				uniform sampler2D uNoiseTexture;
				uniform float uNoiseScale;

				varying vec2 vGrassUv;
      			varying vec3 vColor;
      			varying vec2 vGlobalUV;
      			varying vec2 vUv;
      			varying vec2 vWindColor;
				`
			);

			// Wind displacement using per-instance world position for phase variation
			shader.vertexShader = shader.vertexShader.replace(
				`	#include <fog_vertex>`,
				`	#include <fog_vertex>

				vGrassUv = uv;


   				vec2 uWindDirection = vec2(1.0,1.0);
        		float uWindAmp = 0.1;
        		float uWindFreq = 50.;
        		float uSpeed = 1.0;
        		float uNoiseFactor = 5.50;
        		float uNoiseSpeed = 0.001;

        		vec2 windDirection = normalize(uWindDirection); // Normalize the wind direction
        		vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);

        		float terrainSize = 100.;
        		vGlobalUV = (terrainSize-vec2(modelPosition.xz))/terrainSize;

        		vec4 noise = texture2D(uNoiseTexture,vGlobalUV+uTime*uNoiseSpeed);

        		float sinWave = sin(uWindFreq*dot(windDirection, vGlobalUV) + noise.g*uNoiseFactor + uTime * uSpeed) * uWindAmp * (1.-uv.y);

        		float xDisp = sinWave;
        		float zDisp = sinWave;
        		modelPosition.x += xDisp;
        		modelPosition.z += zDisp;

        		// use perlinNoise to vary the terrainHeight of the grass
        		modelPosition.y += exp(texture2D(uNoiseTexture,vGlobalUV * uNoiseScale).r) * 0.05 * (1.-uv.y);

        		vec4 viewPosition = viewMatrix * modelPosition;
        		vec4 projectedPosition = projectionMatrix * viewPosition;
        		gl_Position = projectedPosition;
`);

			shader.fragmentShader = shader.fragmentShader.replace(
				`#include <common>`,
				`#include <common>
				uniform sampler2D uGrassAlphaTexture;
				uniform vec3 uBaseColor;
				uniform vec3 uTipColor1;
				uniform vec3 uTipColor2;
				uniform sampler2D uNoiseTexture;
				uniform float uNoiseScale;

				varying vec2 vGrassUv;
				varying vec2 vGlobalUV;
				`
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				`#include <map_fragment>`,
				`
				
				vec4 grassVariation = texture2D(uNoiseTexture, vGlobalUV * uNoiseScale);
        		vec3 tipColor = mix(uTipColor1,uTipColor2,grassVariation.r);
				
				vec4 grassAlpha = texture2D(uGrassAlphaTexture, vec2(vGrassUv.x, 1.0 - vGrassUv.y));
				if (grassAlpha.r < 0.1) discard;
				
				vec3 grassColor = mix(tipColor, uBaseColor, vGrassUv.y);
				diffuseColor = vec4(grassColor, 1.0);`
			);
		};
	}

	createChunks(grassSurface: THREE.Mesh) {

		const geometry = grassSurface.geometry.clone();
		geometry.computeBoundingBox();
		geometry.applyMatrix4(grassSurface.matrixWorld);

		// Build BVH directly — no global prototype patch needed
		const bvh = new MeshBVH(geometry);

		this.geoMinX = geometry.boundingBox?.min.x || 0;
		this.geoMaxX = geometry.boundingBox?.max.x || 0;
		this.geoMinZ = geometry.boundingBox?.min.z || 0;
		this.geoMaxZ = geometry.boundingBox?.max.z || 0;

		this.geoLegnthX = Math.abs(this.geoMinX) + Math.abs(this.geoMaxX);
		this.geoLegnthZ = Math.abs(this.geoMinZ) + Math.abs(this.geoMaxZ);

		this.xChuncksAmount = Math.floor(this.geoLegnthX / this.chunkSize);
		this.zChuncksAmount = Math.floor(this.geoLegnthZ / this.chunkSize);

		for (let x = 0; x <= this.xChuncksAmount; x++) {
			for (let z = 0; z <= this.zChuncksAmount; z++) {
				this.createSingleChunk(bvh, x, z);
			}
		}
	}
	createSingleChunk(bvh: MeshBVH, chunkX: number, chunkZ: number) {
		const key = `${chunkX}_${chunkZ}`;
		const grassDensity = 70;

		const mesh = new THREE.InstancedMesh(
			this.grassGeometry,
			this.grassMaterial,
			grassDensity * grassDensity
		);

		const quaternion = new THREE.Quaternion();
		const scale = new THREE.Vector3(4, 4, 4);
		const matrix = new THREE.Matrix4();
		const yAxis = new THREE.Vector3(0, 1, 0);

		const offsetX = this.geoMinX + chunkX * this.chunkSize;
		const offsetZ = this.geoMinZ + chunkZ * this.chunkSize;

		const ray = new THREE.Ray(
			new THREE.Vector3(),
			new THREE.Vector3(0, -1, 0)
		);

		let count = 0;
		for (let x = 0; x < grassDensity; x++) {
			for (let z = 0; z < grassDensity; z++) {
				const px = offsetX + (x / grassDensity) * this.chunkSize;
				const pz = offsetZ + (z / grassDensity) * this.chunkSize;

				ray.origin.set(px, 100, pz);
				const hit = bvh.raycastFirst(ray, THREE.DoubleSide);

				if (!hit) continue;

				quaternion.setFromAxisAngle(yAxis, Math.random() * Math.PI * 2);
				matrix.compose(hit.point, quaternion, scale);
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
			const minX = this.geoMinX + cx * this.chunkSize;
			const maxX = minX + this.chunkSize;
			const minZ = this.geoMinZ + cz * this.chunkSize;
			const maxZ = minZ + this.chunkSize;

			// Distance from player to closest point on chunk AABB
			const dx = Math.max(minX - playerPos.x, 0, playerPos.x - maxX);
			const dz = Math.max(minZ - playerPos.z, 0, playerPos.z - maxZ);
			const visible = dx * dx + dz * dz <= maxDist * maxDist;

			mesh.visible = visible;
			mesh.receiveShadow = visible;
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


		// console.log(this.uniforms.uTipColor1.value.getHex())
		// console.log(this.uniforms.uTipColor2.value.getHex())
		// console.log(this.uniforms.uBaseColor.value.getHex())
		this.uniforms.uTime.value = this.experience.time.elapsed / 1000;
		const playerPos = this.experience.camera.instance.position;
		this.updateChunks(playerPos);
	};

	setDebugObject = () => {
		if (!this.experience?.debug.active) return;

		this.debugFolder = this.experience.debug.ui.addFolder("🌿 New grass");

		this.debugFolder
			.addColor(this.uniforms.uTipColor1, "value").name('tc1')
		this.debugFolder
			.addColor(this.uniforms.uTipColor2, "value").name("tc2")
		this.debugFolder
			.addColor(this.uniforms.uBaseColor, "value").name("bc")

	};
}
