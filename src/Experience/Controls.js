import * as THREE from "three";

import Experience from "./Experience.js";

import Controls from "./Controls/Controls.js";

export default class ModelControls {
  constructor(model) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;

    this.model = model;

    this.speed = 0.0;
    this.velocity = 0.0;
    this.a = new THREE.Vector3();
    this.b = new THREE.Vector3();
    this.dir = new THREE.Vector3();
    this.temp = new THREE.Vector3();
    this.coronaSafetyDistance = 0.3;

    this.keys = { w: false, a: false, s: false, d: false, g: false, p: false };

    this.init();
  }

  init() {
    this.geometry = new THREE.BoxGeometry(0, 0, 0);
    this.material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.controls = new Controls(this.mesh);

    this.camera.lookAt(this.mesh.position);

    this.goal = new THREE.Object3D();
    this.follow = new THREE.Object3D();
    this.follow.position.z = -this.coronaSafetyDistance;

    this.mesh.add(this.follow);
    this.goal.add(this.camera);

    this.mesh.add(this.model);
    this.scene.add(this.mesh);

    document.body.addEventListener("keydown", (event) => {
      const key = event.code.replace("Key", "").toLowerCase();
      if (this.keys[key] !== undefined) {
        this.keys[key] = true;
      }
    });
    document.body.addEventListener("keyup", (event) => {
      const key = event.code.replace("Key", "").toLowerCase();
      if (this.keys[key] !== undefined) {
        this.keys[key] = false;
      }
    });
  }
}
