import Experience from "../Experience.js";

import Ocean from "./Ocean.js";
import Seagulls from "./Seagulls.js";
import Submarine from "./Submarine.js";
import Environment from "./Environment.js";
import Helicopter from "./Helicopter.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    /* Waiting for resources to load */
    this.resources.on("ready", () => {
      this.ocean = new Ocean();
      this.seagulls = new Seagulls();
      this.submarine = new Submarine();
      this.helicopter = new Helicopter();
      this.environment = new Environment();

      this.environment.update();
    });
  }

  update() {
    if (this.ocean) {
      this.ocean.update();
    }

    if (this.seagulls) {
      this.seagulls.update();
    }

    if (this.helicopter) {
      this.helicopter.update();
    }
  }
}
