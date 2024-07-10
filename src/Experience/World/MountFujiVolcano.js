import * as THREE from "three";

import Experience from "../Experience.js";

export default class MountFujiVolcano {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    /* Debug */
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("MountFujiVolcano");
    }

    /* Setup */
    this.resources = this.resources.items.mountFujiVolcanoModel;

    this.setModel();
  }

  setModel() {
    this.model = this.resources.scene;
    this.model.position.set(0, 0, 0);
    this.model.scale.set(0.025, 0.025, 0.04);
    this.model.position.set(5, -45, -225);
    this.model.rotation.y = 1.6;

    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        // child.receiveShadow = true;
      }
    });
    if (this.debug.active) {
      this.debugFolder
        .add(this.model.position, "x")
        .min(-500)
        .max(500)
        .step(0.01);
      this.debugFolder
        .add(this.model.position, "y")
        .min(-500)
        .max(500)
        .step(0.01);
      this.debugFolder
        .add(this.model.position, "z")
        .min(-500)
        .max(500)
        .step(0.01);
      this.debugFolder
        .add(this.model.rotation, "y")
        .min(-360)
        .max(360)
        .step(0.01)
        .name("rotation Y");
    }
  }
}
