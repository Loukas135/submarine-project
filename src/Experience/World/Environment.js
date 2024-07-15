import { Scene, PMREMGenerator, Vector3 } from "three";

import { Sky } from "three/examples/jsm/objects/Sky.js";

import Experience from "../Experience.js";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = experience.scene;
    this.renderer = this.experience.renderer.instance;

    this.renderTarget;
    this.environmentScene = new Scene();
    this.pmremGenerator = new PMREMGenerator(this.renderer);

    this.setSun();
    this.setSkybox();
  }

  setSun() {
    this.sunPosition = new Vector3();
  }

  setSkybox() {
    this.skybox = new Sky();
    this.skybox.scale.setScalar(10000);
    this.scene.add(this.skybox);

    this.skyboxUniforms = this.skybox.material.uniforms;

    this.skyboxUniforms["turbidity"].value = 10;
    this.skyboxUniforms["rayleigh"].value = 2;
    this.skyboxUniforms["mieCoefficient"].value = 0.005;
    this.skyboxUniforms["mieDirectionalG"].value = 0.8;
  }

  update() {
    this.sunPosition.setFromSphericalCoords(1, 1.5, Math.PI);

    this.skybox.material.uniforms["sunPosition"].value.copy(this.sunPosition);

    this.oceanWater = this.experience.world.ocean;

    this.oceanWater.sunDirectionUniform.value
      .copy(this.sunPosition)
      .normalize();

    if (this.renderTarget !== undefined) {
      this.renderTarget.dispose();
    }

    this.environmentScene.add(this.skybox);
    this.renderTarget = this.pmremGenerator.fromScene(this.environmentScene);
    this.scene.add(this.skybox);

    this.scene.environment = this.renderTarget.texture;
  }
}
