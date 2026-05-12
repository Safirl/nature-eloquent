import { Actor } from "@plugins/baseExperience";
import { SkeletonUtils, type GLTF } from "three/examples/jsm/Addons.js";
import * as THREE from "three";
import gsap from "gsap";

export default class PlaceableObject extends Actor {
	private uniforms = {
		uTime: { value: 0 },
		uProgress: { value: 0 },
		uSizeY: { value: 0 },
		uOriginPosition: { value: new THREE.Vector3() },
	};

	constructor(name: string, resource: GLTF) {
		super(name, resource, true, true);
	}

	setModel(makeUnique: boolean): void {
		if (makeUnique) this.model = SkeletonUtils.clone(this.resource.scene);
		else this.model = this.resource.scene;
		this.model.name = this.name;

		this.model.traverse((child: any) => {
			if (child instanceof THREE.Mesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
			if (!child.material) return;
			const material = child.material.clone() as THREE.Material;
			if (material instanceof THREE.MeshStandardMaterial) {
				const envMap = this.experience.world.environment.environmentMap;
				material.envMap = envMap.texture;
				material.envMapIntensity = envMap.intensity;
				material.needsUpdate = true;
			}
			child.material = material;
			child.material.transparent = true;
			material.depthWrite = false;
			material.onBeforeCompile = (shader) => {
				var box = new THREE.Box3().setFromObject(this.model);
				const size = new THREE.Vector3();
				box.getSize(size);
				this.uniforms.uOriginPosition.value = this.model.position;
				this.uniforms.uSizeY.value = size.y;

				Object.assign(shader.uniforms, this.uniforms);
				shader.vertexShader = shader.vertexShader.replace(
					"#include <common>",
					`
					#include <common>
					varying vec4 vPosition;
					varying vec3 vPosition2;
          `
				);
				shader.vertexShader = shader.vertexShader.replace(
					"#include <begin_vertex>",
					`
					#include <begin_vertex>
					vPosition2 = position.xyz;
					vPosition = modelMatrix * vec4(transformed, 1.);
		      `
				);

				shader.fragmentShader = shader.fragmentShader.replace(
					"#include <common>",
					`
			      #include <common>
						uniform float uTime;
						uniform float uSizeY;

						uniform float uProgress;
						uniform vec3 uOriginPosition;
						varying vec4 vPosition;
						varying vec3 vPosition2;
              `
				);
				shader.fragmentShader = shader.fragmentShader.replace(
					"#include <map_fragment>",
					`
			      #include <map_fragment>
						// vec3 finalPosition = normalize(vPosition).xyz;
						// vec3 finalOrigin = normalize(uOriginPosition).xyz;
						float heightRatio = (vPosition.y - uOriginPosition.y) / uSizeY;
						float fadeSize = .8; // taille de la zone de dégradé (0.0 = net, 0.5 = très doux)
            float progress = uProgress * (1.0 + fadeSize); // compense le dépassement
            float alpha = smoothstep(0., fadeSize, progress - heightRatio);
            diffuseColor.a *= alpha;
          `
				);
			};
			if (material.transparent) {
				material.transparent = false;
				material.alphaTest = 0.5;
				material.depthWrite = true;
			}
		});
	}
	spawnAnimate = (duration: number = 3) => {
		gsap.to(this.uniforms.uProgress, {
			value: 1,
			duration: duration,
		});
	};
	update(): void {}
}
