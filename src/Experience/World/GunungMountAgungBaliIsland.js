import * as THREE from "three";

import Experience from "../Experience.js";

export default class GunungMountAgungBaliIsland {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    /* Debug */
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("GunungMountAgungBali");
    }

    /* Setup */
    this.resources = this.resources.items.gunungMountAgungBaliModel;

    this.setModel();
  }

  setModel() {
    this.model = this.resources.scene;
    this.model.position.set(-25, -5, 240);
    this.model.scale.set(0.008, 0.008, 0.008);
    this.model.rotation.y = -91;

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
