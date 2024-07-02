import * as THREE from "three";

import Experience from "../Experience.js";

import vertexShader from "../../shaders/water/vertex.glsl";
import fragmentShader from "../../shaders/water/fragment.glsl";

export default class Sea {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.debugObject = {
      // depthColor: "#126889",
      // surfaceColor: "#1da6e3",
      depthColor: "#050f12",
      surfaceColor: "#1b61eb",
    };

    this.clock = new THREE.Clock();

    /* Debug Folder */
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Sea");
    }

    this.setSea();
  }

  setSea() {
    this.geometry = new THREE.PlaneGeometry(250, 250, 512, 512);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: {
        /* To animate the sea */
        uTime: { value: 0 },

        /* To control the speed, elevation and frequency of the waves */
        uWavesSpeed: { value: 0.7 },
        uWavesElevation: { value: 0.1 },
        uWavesFrequency: { value: new THREE.Vector2(0.2, 0.2) },

        uSmallWavesSpeed: { value: 0.3 },
        uSmallWavesElevation: { value: 0.08 },
        uSmallWavesFrequency: { value: 2.75 },
        uSmallWaveIterations: { value: 3 },

        /* To change the sea's color & opacity */
        uDepthColor: { value: new THREE.Color(this.debugObject.depthColor) },
        uSurfaceColor: {
          value: new THREE.Color(this.debugObject.surfaceColor),
        },
        uColorOffset: { value: 0.06 },
        uColorMultiplier: { value: 5 },
        uColorOpacity: { value: 0.8 },
      },
    });

    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.rotation.x = -Math.PI / 2;

    this.scene.add(this.instance);

    /* Debug */
    if (this.debug.active) {
      this.debugGui();
    }
  }

  debugGui() {
    /* Big waves */
    this.bigWavesFolder = this.debugFolder.addFolder("Big Waves");
    this.bigWavesFolder
      .add(this.material.uniforms.uWavesElevation, "value")
      .min(0)
      .max(1)
      .step(0.01)
      .name("Elevation");
    this.bigWavesFolder
      .add(this.material.uniforms.uWavesFrequency.value, "x")
      .min(0)
      .max(10)
      .step(0.01)
      .name("Frequency-X");
    this.bigWavesFolder
      .add(this.material.uniforms.uWavesFrequency.value, "y")
      .min(0)
      .max(10)
      .step(0.01)
      .name("Frequency-Y");
    this.bigWavesFolder
      .add(this.material.uniforms.uWavesSpeed, "value")
      .min(0)
      .max(10)
      .step(0.001)
      .name("Speed");

    /* Small waves */
    this.smallWavesFolder = this.debugFolder.addFolder("Small Waves");
    this.smallWavesFolder
      .add(this.material.uniforms.uSmallWavesElevation, "value")
      .min(0)
      .max(10)
      .step(0.01)
      .name("Elevation");
    this.smallWavesFolder
      .add(this.material.uniforms.uSmallWavesFrequency, "value")
      .min(0)
      .max(10)
      .step(0.01)
      .name("Frequency");
    this.smallWavesFolder
      .add(this.material.uniforms.uSmallWavesSpeed, "value")
      .min(0)
      .max(10)
      .step(0.01)
      .name("Speed");
    this.smallWavesFolder
      .add(this.material.uniforms.uSmallWaveIterations, "value")
      .min(0)
      .max(5)
      .step(1)
      .name("Iterations");

    /* Colors */
    this.colorFolder = this.debugFolder.addFolder("Colors");
    this.colorFolder
      .addColor(this.debugObject, "depthColor")
      .name("Depth")
      .onChange((newColor) =>
        this.material.uniforms.uDepthColor.value.set(newColor)
      );
    this.colorFolder
      .addColor(this.debugObject, "surfaceColor")
      .name("Surface")
      .onChange((newColor) =>
        this.material.uniforms.uSurfaceColor.value.set(newColor)
      );
    this.colorFolder
      .add(this.material.uniforms.uColorOffset, "value")
      .min(0)
      .max(1)
      .step(0.01)
      .name("Offset");
    this.colorFolder
      .add(this.material.uniforms.uColorMultiplier, "value")
      .min(0)
      .max(10)
      .step(0.01)
      .name("Multiplier");
    this.colorFolder
      .add(this.material.uniforms.uColorOpacity, "value")
      .min(0)
      .max(1)
      .step(0.01)
      .name("Opacity");
  }

  update() {
    this.material.uniforms.uTime.value = this.clock.getElapsedTime();
  }
}
