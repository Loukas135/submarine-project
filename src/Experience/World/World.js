import Experience from "../Experience.js";

import Environment from "./Environment.js";
import Submarine from "./Submarine.js";
import Sea from "./Sea.js";
import Seagulls from "./Seagulls.js";
import EasterIsland from "./EasterIsland.js";
import MountFujiVolcano from "./MountFujiVolcano.js";
import SanSalvadorIsland from "./SanSalvadorIsland.js";
import GunungMountAgungBaliIsland from "./GunungMountAgungBaliIsland.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    /* Waiting for resources to load */
    this.resources.on("ready", () => {
      /* Setup */
      this.sea = new Sea();
      this.seagulls = new Seagulls();
      this.submarine = new Submarine();
      this.environment = new Environment();
      this.easterIsland = new EasterIsland();
      this.mountFujiVolcano = new MountFujiVolcano();
      this.sanSalvadorIsland = new SanSalvadorIsland();
      this.gunungMountAgungBali = new GunungMountAgungBaliIsland();
    });
  }

  update() {
    if (this.seagulls) {
      this.seagulls.update();
    }

    if (this.sea) {
      this.sea.update();
    }
  }
}
