import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/Addons.js";

import Experience from "./Experience.js";

import environmentVertexShader from "../shaders/environment/vertex.glsl";
import environmentFragmentShader from "../shaders/environment/fragment.glsl";

export default class Composer {
  constructor() {
    this.experience = new Experience();
    this.renderer = this.experience.renderer.instance;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;

    this.setInstance();
  }

  setInstance() {
    this.instance = new EffectComposer(this.renderer);
    this.instance.addPass(new RenderPass(this.scene, this.camera));

    this.environmentShader = new THREE.ShaderMaterial({
      vertexShader: environmentVertexShader,
      fragmentShader: environmentFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        isUnderWater: { value: false },
      },
    });

    this.environmentShaderPass = new ShaderPass(this.environmentShader);

    this.instance.addPass(this.environmentShaderPass);
  }

  update() {
    this.instance.render();

    const underWaterUniform = this.environmentShaderPass.uniforms.isUnderWater;
    const isUnderWater = underWaterUniform.value === true;
    const cameraHeight = this.camera.position.y;

    if (cameraHeight < 0 && !isUnderWater) {
      underWaterUniform.value = true;
    } else if (cameraHeight >= 0 && isUnderWater) {
      underWaterUniform.value = false;
    }
  }
}
