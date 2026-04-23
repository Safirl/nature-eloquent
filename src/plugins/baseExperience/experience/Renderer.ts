import * as THREE from "three";
import Experience from "./Experience";
import { EffectComposer, RenderPass, ShaderPass, type Pass } from "three/examples/jsm/Addons.js";
import { GammaCorrectionShader } from "three/examples/jsm/Addons.js";

export default class Renderer {
  declare experience: Experience;
  declare canvas: Experience["canvas"];
  declare sizes: Experience["sizes"];
  declare scene: Experience["scene"];
  declare camera: Experience["camera"];
  declare instance: THREE.WebGLRenderer;
  protected declare composer: EffectComposer | null
  protected declare gammaPass: ShaderPass

  constructor() {
    if (!Experience.instance) throw new Error("Renderer initialization failed: Experience.instance is not available. Ensure Experience is initialized before creating the Renderer.");

    this.experience = Experience.instance;
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFShadowMap;
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.setClearColor(0x211d20);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    if (this.composer) {
      this.composer.setSize(this.sizes.width, this.sizes.height);
      this.composer.setPixelRatio(this.sizes.pixelRatio);
    }
  }

  addComposerPass(pass: Pass, afterGammaCorrectionPass?: boolean, index?: number) {
    if (!this.composer) {
      this.initializeComposer();
    }
    if (typeof index === "number") {
      this.composer?.insertPass(pass, index)
    }
    else if (!afterGammaCorrectionPass) {
      this.composer?.insertPass(pass, this.composer.passes.length - 1)
    }
    else {
      this.composer?.addPass(pass)
    }
  }

  initializeComposer() {
    const renderTarget = new THREE.WebGLRenderTarget(
      800,
      600,
      {
        samples: this.experience.sizes.pixelRatio < 2 ? 2 : 1
      }
    );
    this.composer = new EffectComposer(this.instance, renderTarget);
    this.composer.setPixelRatio(this.experience.sizes.pixelRatio)
    this.composer.setSize(this.experience.sizes.width, this.experience.sizes.height)

    const renderPass = new RenderPass(this.scene, this.camera.instance);
    this.composer.addPass(renderPass);

    this.gammaPass = new ShaderPass(GammaCorrectionShader)
    this.composer.addPass(this.gammaPass)
  }

  update() {
    if (this.composer) {
      this.composer.render()
    }
    else {
      this.instance.render(this.scene, this.camera.instance);
    }
  }
}
