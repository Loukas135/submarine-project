import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Experience from "./Experience.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      /* Setup */
      this.world = this.experience.world;
      this.submarine = this.world.submarine;
    });

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      1,
      1000
    );

    this.instance.position.set(0, 4, 0);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.minDistance = 10;
    this.controls.maxDistance = 60;
    this.controls.enablePan = false;
    this.controls.enableDamping = true;
    this.controls.rotateSpeed = 0.7;
    this.instance.position.set(0, 4, 12);
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.submarine = this.experience.world.submarine;
    if (this.submarine) {
      const submarinePosition = this.submarine.model.position;
      this.instance.lookAt(submarinePosition);
      this.controls.update();
    }

    this.controls.update();
  }
}
