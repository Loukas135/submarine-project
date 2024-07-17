import * as THREE from "three";

import Experience from "../Experience.js";

import MobileControls from "../../MobileControls.js";

export default class Controls {
  constructor() {
    this.experience = new Experience();
    // this.submarine = this.experience.world.submarine;

    this.mobileControls = new MobileControls();
    this.mobileControlButtons = this.mobileControls.buttons;

    this.addButtonsEventListeners();
    this.addKeyboardEventListeners();
  }

  handlePress(event) {
    const key = event.target.getAttribute("data-key");

    if (key === "w" || event.key === "w" || event.key === "W") {
      console.log("first");
    }

    console.log(key);
    console.log(event.key);
  }

  handleRelease(event) {
    // const key = event.target.getAttribute("data-key");
    // console.log(key);
  }

  addButtonsEventListeners() {
    for (const key in this.mobileControlButtons) {
      const button = this.mobileControlButtons[key];

      /* Touch Event */
      button.addEventListener("touchstart", (event) => this.handlePress(event));

      button.addEventListener("touchend", (event) => this.handleRelease(event));

      /* Mouse Clicking Event */
      button.addEventListener("mousedown", (event) => this.handlePress(event));

      button.addEventListener("touchend", (event) => this.handleRelease(event));
    }
  }

  addKeyboardEventListeners() {
    /* Pressing & Holding the key */
    document.addEventListener("keydown", (event) => this.handlePress(event));

    /* Releasing the key */
    document.addEventListener("keyup", (event) => this.handleRelease(event));
  }
}
