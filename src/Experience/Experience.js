import { Scene, Mesh } from "three";

import World from "./World/World.js";

import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import Composer from "./Composer.js";

import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Resources from "./Utils/Resources.js";
import Debug from "./Utils/Debug.js";

import Controls from "./Controls/Controls.js";

import sources from "./sources.js";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }

    instance = this;

    /* Global Access */
    window.experience = this;

    /* Options */
    this.canvas = canvas;

    /* Setup */

    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.Composer = new Composer();
    this.resources = new Resources(sources);

    this.world = new World();
    this.debug = new Debug();

    /* Resize Event */
    this.sizes.on("resize", () => {
      this.resize();
    });

    /* Updating Time */
    this.time.on("update", () => {
      this.update();
    });

    /* Setting Controls */
    const controls = new Controls();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    // this.renderer.update();
    this.Composer.update();

    if (this.world.submarine) {
      this.world.submarine.update();
    }
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("update");

    /* Traverse the whole scene */
    this.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) {
      this.debug.ui.dispose();
    }
  }
}
