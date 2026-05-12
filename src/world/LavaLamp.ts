import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";

const BLOB_COUNT = 7;

const vertexShader = /* glsl */ `
varying vec3 vWorldPos;

void main() {
	vec4 worldPos = modelMatrix * vec4(position, 1.0);
	vWorldPos = worldPos.xyz;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
#define N ${BLOB_COUNT}

uniform float uTime;
uniform vec3 uBlobPositions[N];
uniform float uBlobRadius;
uniform float uSmoothK;
uniform vec3 uCylCenter;
uniform float uCylRadius;
uniform float uCylHeight;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform vec3 uLightColor;

varying vec3 vWorldPos;

float smin(float a, float b, float k) {
	float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
	return mix(b, a, h) - k * h * (1.0 - h);
}

float hash(vec3 p) {
	p = fract(p * vec3(127.1, 311.7, 74.7));
	p += dot(p, p.zyx + 19.19);
	return fract((p.x + p.y) * p.z);
}

float vnoise(vec3 p) {
	vec3 i = floor(p);
	vec3 f = fract(p);
	vec3 u = f * f * (3.0 - 2.0 * f);
	return mix(
		mix(mix(hash(i), hash(i + vec3(1,0,0)), u.x),
		    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), u.x), u.y),
		mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), u.x),
		    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), u.x), u.y),
		u.z);
}

// Capped cylinder SDF (Y-aligned, centered at uCylCenter)
float sdCylinder(vec3 p) {
	vec3 q = p - uCylCenter;
	vec2 d = abs(vec2(length(q.xz), q.y)) - vec2(uCylRadius, uCylHeight * 0.5);
	return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float bottomLightSDF(vec3 p) {
	vec3 q = p - vec3(uCylCenter.x, uCylCenter.y - uCylHeight * 0.5 + 0.007, uCylCenter.z);
	float disc = max(length(q.xz) - uCylRadius * 0.82, abs(q.y) - 0.005);
	return max(disc, sdCylinder(p));
}

float sceneSDF(vec3 p) {
	float d = length(p - uBlobPositions[0]) - uBlobRadius;
	for (int i = 1; i < N; i++) {
		d = smin(d, length(p - uBlobPositions[i]) - uBlobRadius, uSmoothK);
	}
	// Displace the merged surface with animated noise
	float n = vnoise(p * uNoiseFreq + uTime * 0.35);
	d += (n - 0.5) * uNoiseAmp;
	// Intersect blobs with cylinder interior
	return max(d, sdCylinder(p));
}

vec3 calcNormal(vec3 p) {
	const float e = 0.002;
	return normalize(vec3(
		sceneSDF(p + vec3(e, 0.0, 0.0)) - sceneSDF(p - vec3(e, 0.0, 0.0)),
		sceneSDF(p + vec3(0.0, e, 0.0)) - sceneSDF(p - vec3(0.0, e, 0.0)),
		sceneSDF(p + vec3(0.0, 0.0, e)) - sceneSDF(p - vec3(0.0, 0.0, e))
	));
}

void main() {
	vec3 ro = cameraPosition;
	vec3 rd = normalize(vWorldPos - cameraPosition);

	// Start marching from the box front face
	float t = length(vWorldPos - cameraPosition);
	float tMax = t + uCylHeight * 2.0;

	vec4 color = vec4(0.0);

	for (int i = 0; i < 96; i++) {
		vec3 p = ro + rd * t;
		float d = sceneSDF(p);
		float dLight = bottomLightSDF(p);

		if (dLight < 0.001) {
			float pulse = 0.9 + 0.1 * sin(uTime * 3.0);
			color = vec4(uLightColor * pulse * 1.8, 1.0);
			break;
		}

		if (d < 0.0008) {
			vec3 n = calcNormal(p);
			vec3 lightDir = normalize(vec3(1.0, 2.0, 1.5));
			float diff = max(dot(n, lightDir), 0.0);
			float fresnel = pow(1.0 - abs(dot(n, -rd)), 3.0);

			// Blend color from bottom to top of cylinder
			float tBlend = (p.y - (uCylCenter.y - uCylHeight * 0.5)) / uCylHeight;
			vec3 col = mix(uColor1, uColor2, clamp(tBlend, 0.0, 1.0));
			col = col * (0.35 + 0.65 * diff) + col * (fresnel * 0.4);

			// Bottom light upward contribution
			float lightDist = p.y - (uCylCenter.y - uCylHeight * 0.5);
			float lightAtten = 1.0 / (1.0 + lightDist * lightDist * 25.0);
			col += uLightColor * lightAtten * 0.4;

			color = vec4(col, 0.93);
			break;
		}

		t += max(min(d, dLight) * 0.6, 0.001);
		if (t > tMax) break;
	}

	if (color.a < 0.01) discard;

	gl_FragColor = color;
}
`;

export default class LavaLamp implements LifeTimeObject {
	declare private experience: Experience;
	declare private debugFolder: GUI;
	declare private scene: THREE.Scene;
	declare private lavaMesh: THREE.Mesh;
	declare private cylinderMaterial: THREE.MeshPhysicalMaterial;
	declare private bottomLight: THREE.PointLight;
	declare private uniforms: Record<string, THREE.IUniform>;
	private cylinderCenter = new THREE.Vector3();
	private cylinderRadius = 0.15;
	private cylinderHeight = 0.8;
	private cylinderY = 0;
	private position = new THREE.Vector3(0, 0.85, 0);
	constructor() {
		if (!Experience.instance) return;

		this.experience = Experience.instance;
		this.scene = this.experience.scene;
	}

	init() {
		const gltf = (this.experience.resources.items.room as GLTF).scene.children.find(
			(item) => item.name === "Cylinder"
		);
		// gltf.scene.traverse((child) => {
		// 	child.position.copy(this.position);
		// 	child.scale.setScalar(0.5);
		// });

		// this.scene.add(gltf.scene);

		if (gltf instanceof THREE.Mesh) {
			this.cylinderMaterial = new THREE.MeshPhysicalMaterial({
				color: new THREE.Color("#bc2f2f"),
				transmission: 1,
				roughness: 0,
				metalness: 0,
				opacity: 0.28,
				thickness: 2.355,
				transparent: true,
			});
			gltf.material = this.cylinderMaterial;

			const worldBox = new THREE.Box3().setFromObject(gltf);
			const size = new THREE.Vector3();
			worldBox.getCenter(this.cylinderCenter);
			worldBox.getSize(size);

			this.cylinderRadius = (size.x + size.z) / 4;
			this.cylinderHeight = size.y;
			this.cylinderY = worldBox.min.y + this.position.y / 2;
			this.createLavaMesh();
		}
	}

	private createLavaMesh() {
		const blobPositions: THREE.Vector3[] = Array.from(
			{ length: BLOB_COUNT },
			() => new THREE.Vector3()
		);

		this.uniforms = {
			uTime: { value: 0 },
			uBlobPositions: { value: blobPositions },
			uBlobRadius: { value: this.cylinderRadius * 0.5 },
			uSmoothK: { value: this.cylinderRadius * 0.4 },
			uCylCenter: { value: this.cylinderCenter.clone() },
			uCylRadius: { value: this.cylinderRadius * 0.9 },
			uCylHeight: { value: this.cylinderHeight * 1 },
			uColor1: { value: new THREE.Color("#8a0700") },
			uColor2: { value: new THREE.Color("#790101") },
			uLightColor: { value: new THREE.Color("#ff7700") },
			uNoiseAmp: { value: this.cylinderRadius * 0.35 },
			uNoiseFreq: { value: 5.0 },
		};

		const material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms: this.uniforms,
			transparent: false,
			depthWrite: true,
			side: THREE.FrontSide,
		});

		const pad = 1.1;
		const geometry = new THREE.BoxGeometry(
			this.cylinderRadius * 2 * pad,
			this.cylinderHeight * pad,
			this.cylinderRadius * 2 * pad
		);

		this.lavaMesh = new THREE.Mesh(geometry, material);
		this.lavaMesh.position.copy(this.cylinderCenter);
		this.lavaMesh.scale.set(0.62, 1, 0.62);
		// this.lavaMesh.renderOrder = 1;
		this.lavaMesh.position.y = this.cylinderY;
		this.scene.add(this.lavaMesh);

		this.bottomLight = new THREE.PointLight(0xff7700, 2.0, this.cylinderHeight * 4);
		this.bottomLight.position.set(this.cylinderCenter.x, this.cylinderY + this.cylinderHeight, this.cylinderCenter.z);
		this.scene.add(this.bottomLight);

		this.setDebugObject();
	}

	update = () => {
		if (!this.uniforms) return;

		const t = this.experience.time.elapsed * 0.001;
		this.uniforms.uTime.value = t;

		const meshWorldPos = new THREE.Vector3();
		this.lavaMesh.getWorldPosition(meshWorldPos);
		this.uniforms.uCylCenter.value.copy(meshWorldPos);

		const positions = this.uniforms.uBlobPositions.value as THREE.Vector3[];
		const r = this.cylinderRadius * 0.5;
		const h = this.cylinderHeight * 0.38;
		const cx = meshWorldPos.x;
		const cy = meshWorldPos.y;
		const cz = meshWorldPos.z;

		this.bottomLight.position.set(meshWorldPos.x, meshWorldPos.y, meshWorldPos.z);
		this.bottomLight.intensity = 1.5 + 0.5 * Math.sin(t * 3.0);

		for (let i = 0; i < BLOB_COUNT; i++) {
			const phase = (i / BLOB_COUNT) * Math.PI * 2;
			const riseSpeed = 0.18 + i * 0.05;
			const driftSpeed = 0.12 + i * 0.03;

			positions[i].set(
				cx + Math.cos(phase + t * driftSpeed) * r * 0.7,
				cy + Math.sin(t * riseSpeed + phase) * h,
				cz + Math.sin(phase + t * driftSpeed * 1.3) * r * 0.7
			);
		}
	};

	setDebugObject = () => {
		if (!this.experience?.debug.active) return;

		this.debugFolder = this.experience.debug.ui.addFolder("🌋 Lava Lamp");

		this.debugFolder.addColor(this.uniforms.uColor1, "value").name("color1");
		this.debugFolder.addColor(this.uniforms.uColor2, "value").name("color2");
		this.debugFolder
			.addColor(this.uniforms.uLightColor, "value")
			.name("lightColor")
			.onChange((v: THREE.Color) => this.bottomLight.color.copy(v));

		const glassFolder = this.debugFolder.addFolder("Glass");
		const colorProxy = { color: "#" + this.cylinderMaterial.color.getHexString() };
		glassFolder
			.addColor(colorProxy, "color")
			.name("color")
			.onChange((v: string) => this.cylinderMaterial.color.set(v));
		glassFolder.add(this.cylinderMaterial, "transmission", 0, 1).name("transmission");
		glassFolder.add(this.cylinderMaterial, "roughness", 0, 1).name("roughness");
		glassFolder.add(this.cylinderMaterial, "metalness", 0, 1).name("metalness");
		glassFolder.add(this.cylinderMaterial, "thickness", 0, 5).name("thickness");
		glassFolder
			.add(this.cylinderMaterial, "emissiveIntensity", 0, 10)
			.name("emissiveIntensity");
		glassFolder.add(this.cylinderMaterial, "transparent").name("transparent");
		glassFolder.add(this.cylinderMaterial, "opacity", 0, 1).name("opacity");

		const scaleFolder = this.debugFolder.addFolder("Scale");
		scaleFolder.add(this.lavaMesh.scale, "x", 0, 3, 0.01).name("scale X");
		scaleFolder.add(this.lavaMesh.scale, "y", 0, 3, 0.01).name("scale Y");
		scaleFolder.add(this.lavaMesh.scale, "z", 0, 3, 0.01).name("scale Z");
	};

	destroy = () => {
		this.lavaMesh?.geometry.dispose();
		(this.lavaMesh?.material as THREE.Material)?.dispose();
		this.scene.remove(this.lavaMesh);
		this.bottomLight?.dispose();
		this.scene.remove(this.bottomLight);
	};
}
