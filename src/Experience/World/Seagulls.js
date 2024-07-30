import * as THREE from "three";

import Experience from "../Experience.js";

export default class Seagulls {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    /* Debug */
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Seagulls");
    }

    /* Setup */
    this.resources = this.resources.items.seagullsModel;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resources.scene;
    this.model.position.set(-2.5, 3, -3);
    this.model.scale.set(0.2, 0.2, 0.2);

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
        .min(-20)
        .max(20)
        .step(0.01);
      this.debugFolder
        .add(this.model.position, "y")
        .min(-20)
        .max(20)
        .step(0.01);
      this.debugFolder
        .add(this.model.position, "z")
        .min(-20)
        .max(20)
        .step(0.01);
    }
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.action = this.animation.mixer.clipAction(
      this.resources.animations[0]
    );
    this.animation.action.play();
  }

  update() {
    this.animation.mixer.update(this.experience.time.delta * 0.001);
  }
}
