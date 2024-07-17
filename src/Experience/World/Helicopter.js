import {
  Mesh,
  Line,
  Vector3,
  AnimationMixer,
  BufferGeometry,
  CatmullRomCurve3,
  LineBasicMaterial,
} from "three";

import Experience from "../Experience.js";

export default class Helicopter {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    /* Debug */
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Helicopter");
    }

    /* Setup */
    this.audio = this.resources.items.helicopterAudio;
    this.resource = this.resources.items.helicopterModel;

    this.setModel();
    this.setAnimation();
    this.setPath();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(1.2, 1.2, 1.2);

    this.model.add(this.audio);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof Mesh) {
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
    this.animation.mixer = new AnimationMixer(this.model);
    this.animation.action = this.animation.mixer.clipAction(
      this.resource.animations[0]
    );
    this.animation.action.play();
  }

  setPath() {
    this.points = [
      new Vector3(-300, 20, -300),
      new Vector3(-170, 20, -50),
      new Vector3(30, 20, 90),
      new Vector3(380, 20, 250),
      new Vector3(250, 20, -400),
    ];

    this.path = new CatmullRomCurve3(this.points, true);

    this.pathGeometry = new BufferGeometry().setFromPoints(
      this.path.getPoints(100)
    );
    this.pathMaterial = new LineBasicMaterial({
      color: "#0000ff",
    });

    this.pathObject = new Line(this.pathGeometry, this.pathMaterial);

    // this.scene.add(this.pathObject);
  }

  update() {
    this.delta = this.experience.time.delta;

    this.animation.mixer.update(this.delta * 0.001);

    this.date = Date.now();
    this.time = ((this.date / 10000) % 6) / 6;
    this.position = this.path.getPointAt(this.time);
    this.tan = this.path.getTangentAt(this.time).normalize();

    this.model.position.copy(this.position);

    this.lookPosition = new Vector3(
      this.position.x,
      this.position.y - 0.35,
      this.position.z
    );
    this.model.lookAt(this.lookPosition.add(this.tan));
  }
}
