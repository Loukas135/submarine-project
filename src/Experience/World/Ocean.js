import * as THREE from "three";

import { Water } from "three/examples/jsm/objects/Water.js";

import Experience from "../Experience.js";

export default class Ocean {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.setGeometry();
    this.setTexture();
    this.setMaterial();
    this.setWater();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(10000, 10000);
  }

  setTexture() {
    this.textures = {};

    this.textures.normal = this.resources.items.waterNormalsTexture;
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }

  setMaterial() {
    this.materialOptions = {
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      side: THREE.DoubleSide,
      sunDirection: new THREE.Vector3(),
      waterNormals: this.textures.normal,
    };
  }

  setWater() {
    this.instance = new Water(this.geometry, this.materialOptions);
    this.instance.rotation.x = -Math.PI / 2;

    this.scene.add(this.instance);

    this.sunDirectionUniform = this.instance.material.uniforms["sunDirection"];
  }

  update() {
    this.instance.material.uniforms["time"].value += this.time.delta / 3000.0;
  }
}
