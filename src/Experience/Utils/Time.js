import * as THREE from "three";

import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.threeTime = new THREE.Clock();

    this.threeDelta = this.threeTime.getElapsedTime();
    this.lastFrameTime = this.threeTime.getElapsedTime();

    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  update() {
    this.threeDelta = this.threeTime.getElapsedTime() - this.lastFrameTime;

    this.lastFrameTime = this.threeTime.getElapsedTime();
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.trigger("update");

    window.requestAnimationFrame(() => {
      this.update();
    });
  }
}
