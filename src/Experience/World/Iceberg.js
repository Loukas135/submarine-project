import * as THREE from "three";

import Experience from "../Experience.js";

export default class Iceberg {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    /* Debug */
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Iceberg");
    }

    /* Setup */
    this.resource = this.resources.items.icebergModel;

    this.setModel();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.position.set(-40, 0, -40);
    this.model.scale.set(5, 5, 5);
    //this.scene.add(this.cub1);
    // this.cube1 = new THREE.Mesh(
    //   new THREE.BoxGeometry(3, 3, 3),
    //   new THREE.MeshBasicMaterial({
    //     transparent: true,
    //   })
    // );
    // this.cube1.position.copy(this.model.position);

    // this.cube1.add(this.model);
    // this.model = this.cube1;

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(5, 5, 5),
      new THREE.MeshBasicMaterial({ opacity: 1, transparent: true })
    );
    this.cubebb1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.cubebb1.setFromObject(this.cube);
    this.model.add(this.cube);

    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
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
}
