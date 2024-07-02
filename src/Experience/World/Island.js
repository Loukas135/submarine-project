import * as THREE from "three";

import Experience from "../Experience.js";

export default class Island {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    /* Debug */
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Island");
    }

    /* Setup */
    this.resources = this.resources.items.easterIsland;

    this.setModel();
  }

  setModel() {
    this.model = this.resources.scene;
    this.model.position.set(170, -19.5, 0);
    this.model.rotation.y = -222;
    this.model.scale.set(150, 500, 150);

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
        .min(-100)
        .max(100)
        .step(0.01);
      this.debugFolder
        .add(this.model.position, "y")
        .min(-100)
        .max(100)
        .step(0.01);
      this.debugFolder
        .add(this.model.position, "z")
        .min(-100)
        .max(100)
        .step(0.01);
      this.debugFolder
        .add(this.model.rotation, "y")
        .min(-360)
        .max(360)
        .step(0.01);
    }
  }
}
