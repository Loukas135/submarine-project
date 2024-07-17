import { arrowUpIcon } from "./static/icons/arrowUp.js";
import { arrowRightIcon } from "./static/icons/arrowRight.js";
import { arrowDownIcon } from "./static/icons/arrowDown.js";
import { arrowLeftIcon } from "./static/icons/arrowLeft.js";

import { diveIcon } from "./static/icons/dive.js";
import { ariseIcon } from "./static/icons/arise.js";

let instance = null;

export default class MobileControls {
  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;

    this.buttons = {};

    this.selectButtons();
    this.setIcons();
  }

  selectButtons() {
    this.buttons.moveForwardButton = document.getElementById("move-forward");
    this.buttons.moveForwardButton.key = "w";

    this.buttons.moveRightwardButton =
      document.getElementById("move-rightward");

    this.buttons.moveBackwardButton = document.getElementById("move-backward");

    this.buttons.moveLeftwardButton = document.getElementById("move-leftward");

    this.buttons.diveButton = document.getElementById("dive");

    this.buttons.ariseButton = document.getElementById("arise");
  }

  setIcons() {
    this.buttons.moveForwardButton.innerHTML = arrowUpIcon;
    this.buttons.moveRightwardButton.innerHTML = arrowRightIcon;
    this.buttons.moveBackwardButton.innerHTML = arrowDownIcon;
    this.buttons.moveLeftwardButton.innerHTML = arrowLeftIcon;

    this.buttons.diveButton.innerHTML = diveIcon;
    this.buttons.ariseButton.innerHTML = ariseIcon;
  }
}
