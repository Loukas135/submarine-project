import Experience from "./Experience/Experience.js";

import MobileControls from "./MobileControls.js";

const backdrop = document.getElementById("backdrop");
const startButton = document.getElementById("start-button");

const mobileControls = new MobileControls();

startButton.addEventListener("click", () => {
  backdrop.remove();

  const canvas = document.querySelector("canvas.webgl");
  const experience = new Experience(canvas);
});
