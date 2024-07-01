import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import Experience from "./Experience.js";

import underWaterVertexShader from "../shaders/underWater/vertex.glsl";
import underWaterFragmentShader from "../shaders/underWater/fragment.glsl";

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

    this.underWaterShader = new THREE.ShaderMaterial({
      vertexShader: underWaterVertexShader,
      fragmentShader: underWaterFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
      },
    });

    this.shaderPass = new ShaderPass(this.underWaterShader);
  }

  update() {
    this.instance.render();

    const lastPass = this.instance.passes[this.instance.passes.length - 1];

    const isShaderPass = lastPass instanceof ShaderPass;

    if (this.camera.position.y < 0 && !isShaderPass) {
      this.instance.addPass(this.shaderPass);
    } else if (this.camera.position.y >= 0 && isShaderPass) {
      this.instance.removePass(lastPass);
    }
  }
}
