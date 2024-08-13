import gsap from "gsap";

import Experience from "../Experience.js";

import MobileControls from "./MobileControls.js";

import { constants } from "../Physics/constants.js";

export default class Controls {
  constructor(model) {
    this.experience = new Experience();
    this.camera = this.experience.camera.instance;
    this.orbitControls = this.experience.camera.controls;

    this.cameraPosition = this.camera.position;
    this.cameraRotation = this.camera.rotation;

    this.model = model;
    this.modelPosition = this.model.position;
    this.modelRotation = this.model.rotation;

    this.mobileControls = new MobileControls();
    this.mobileControlButtons = this.mobileControls.buttons;

    this.addKeyboardEventListeners();
  }

  resetCameraPosition() {
    gsap.to(this.cameraPosition, {
      duration: 2,
      x: this.modelPosition,
      y: this.modelPosition + 4,
      z: this.modelPosition + 12,
    });
  }

  moveForwardEvent() {
    // this.modelPosition.z -= 0.01;
    // this.cameraPosition.z -= 0.01;
    // this.orbitControls.target.z -= 0.01;

    constants.Yangle += 0.01;
  }

  moveRightwardEvent() {
    constants.angle += 0.01;
  }

  moveLeftwardEvent() {
    constants.angle -= 0.01;
  }

  moveBackwardEvent() {
    // this.cameraPosition.z += 0.01;
    constants.Yangle = 0.01;
  }

  dive() {}

  arise() {}

  addKeyboardEventListeners() {
    const pressedKeys = {};

    /* Event to listen to key presses */
    document.addEventListener("keydown", (event) => {
      pressedKeys[event.key] = true;

      /* To handle each key */
      if (pressedKeys["w"] || pressedKeys["W"]) {
        this.moveForwardEvent();
      }

      if (pressedKeys["a"] || pressedKeys["A"]) {
        this.moveLeftwardEvent();
      }

      if (pressedKeys["s"] || pressedKeys["S"]) {
        this.moveBackwardEvent();
      }

      if (pressedKeys["d"] || pressedKeys["D"]) {
        this.moveRightwardEvent();
      }

      if (pressedKeys["e"] || pressedKeys["E"]) {
        this.arise();
      }

      if (pressedKeys["f"] || pressedKeys["F"]) {
        this.dive();
      }
    });

    /* Handle relese the button */
    document.addEventListener("keyup", (event) => {
      pressedKeys[event.key] = false;
    });
  }
}
