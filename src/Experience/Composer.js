import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

import Experience from "./Experience.js";

import environmentVertexShader from "../shaders/environment/vertex.glsl";
import environmentFragmentShader from "../shaders/environment/fragment.glsl";

import toneMappingVertexShader from "../shaders/toneMapping/vertex.glsl";
import toneMappingFragmentShader from "../shaders/toneMapping/fragment.glsl";

export default class Composer {
  constructor() {
    this.experience = new Experience();
    this.renderer = this.experience.renderer.instance;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;

    this.setPasses();
    this.setInstance();
  }

  setPasses() {
    this.renderPass = new RenderPass(this.scene, this.camera);

    this.toneMappingPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        exposure: { value: 0.2 },
      },
      vertexShader: toneMappingVertexShader,
      fragmentShader: toneMappingFragmentShader,
    });

    this.environmentShaderPass = new ShaderPass({
      vertexShader: environmentVertexShader,
      fragmentShader: environmentFragmentShader,
      uniforms: {
        tDiffuse: { value: null },
        isUnderWater: { value: false },
      },
    });
  }

  setInstance() {
    this.instance = new EffectComposer(this.renderer);
    this.instance.addPass(this.renderPass);
    this.instance.addPass(this.toneMappingPass);
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
