import * as THREE from "three";
import gsap from "gsap";

import Experience from "../Experience.js";

import MobileControls from "./MobileControls.js";

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

    this.addButtonsEventListeners();
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
    gsap.to(this.modelPosition, {
      duration: 2,
      z: this.modelPosition.z - 3,
    });

    gsap.to(this.cameraPosition, {
      duration: 2,
      z: this.cameraPosition.z - 3,
    });

    gsap.to(this.orbitControls.target, {
      duration: 2,
      z: this.modelPosition.z - 3,
    });
  }

  moveRightwardEvent() {
    gsap.to(this.modelRotation, {
      duration: 2,
      y: this.modelRotation.y - Math.PI / 10,
    });

    gsap.to(this.cameraRotation, {
      duration: 2,
      y: this.cameraRotation.y - Math.PI / 10,
    });

    // gsap.to(this.orbitControls.target, {
    //   duration: 2,
    //   z: this.modelPosition.z - 3
    // });
  }

  moveLeftwardEvent() {
    gsap.to(this.modelRotation, {
      duration: 2,
      y: this.modelRotation.y + Math.PI / 10,
    });

    gsap.to(this.cameraPosition, {
      duration: 2,
      y: this.modelRotation.y + Math.PI / 10,
    });
  }

  moveBackwardEvent() {
    gsap.to(this.modelPosition, {
      duration: 2,
      z: this.modelPosition.z + 3,
    });

    gsap.to(this.cameraPosition, {
      duration: 2,
      z: this.cameraPosition.z + 3,
    });

    gsap.to(this.orbitControls.target, {
      duration: 2,
      z: this.modelPosition.z + 3,
    });
  }

  dive() {
    gsap.to(this.modelPosition, {
      duration: 2,
      z: this.modelPosition.y - 1,
    });
  }

  arise() {
    gsap.to(this.modelPosition, {
      duration: 2,
      z: this.modelPosition.y + 1,
    });
  }

  handlePress(event) {
    // this.resetCameraPosition();

    const key = event.target.getAttribute("data-key");

    if (key === "w" || event.key === "w" || event.key === "W") {
      this.moveForwardEvent();
    } else if (key === "a" || event.key === "a" || event.key === "A") {
      this.moveLeftwardEvent();
    } else if (key === "s" || event.key === "s" || event.key === "S") {
      this.moveBackwardEvent();
    } else if (key === "d" || event.key === "d" || event.key === "D") {
      this.moveRightwardEvent();
    } else if (key === "e" || event.key === "e" || event.key === "E") {
      this.arise();
    } else if (key === "f" || event.key === "f" || event.key === "F") {
      this.dive();
    }
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
