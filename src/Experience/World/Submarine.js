import {
  Mesh,
  Clock,
  BoxGeometry,
  MeshBasicMaterial,
  Box3,
  Vector3,
} from "three";

import Experience from "../Experience.js";

import Controls from "../Controls.js";
import Physics from "../Physics/Physics.js";
import { constants } from "../Physics/constants.js";
import { degToRad } from "three/src/math/MathUtils.js";
import Iceberg from "./Iceberg.js";

export default class Submarine {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.resources = this.experience.resources;
    this.camera = this.experience.camera.instance;

    this.lastFrameTime = 0;

    this.physics = new Physics();
    /* Debug */
    if (this.debug.active) {
      this.startExperimenting = this.debug.ui.addFolder("startExperimenting");
      this.initialFolder = this.startExperimenting.addFolder("initialFolder");
      this.debugFolder = this.startExperimenting.addFolder("submarine");
    }

    /* Setup */
    this.audio = this.resources.items.submarineAudio;
    this.resource = this.resources.items.submarineModel;

    this.clock = new Clock();

    this.setModel();
    this.setControls();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.1, 0.1, 0.1);
    this.model.add(this.audio);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    /* Debug */
    if (this.debug.active) {
      this.initialFolder
        .add(this.model.position, "x")
        .min(-10)
        .max(10)
        .step(0.01);
      this.initialFolder
        .add(this.model.position, "y")
        .min(-10)
        .max(10)
        .step(0.01);
      this.initialFolder
        .add(this.model.position, "z")
        .min(-10)
        .max(10)
        .step(0.01);
      this.initialFolder
        .add(constants, "power")
        .min(900)
        .max(3000)
        .step(100)
        .onChange((value) => {
          constants.power = value;
        });
      this.initialFolder
        .add(constants, "massSubmarine")
        .min(10)
        .max(constants.massSubmarine)
        .step(10)
        .onChange((value) => {
          constants.massSubmarine = value;
        });
      this.initialFolder
        .add(constants, "V")
        .min(10)
        .max(constants.V)
        .step(10)
        .onChange((value) => {
          constants.V = value;
        });
      this.debugFolder.add(constants, "Diving").onChange((value) => {
        if (value) {
          constants.Diving = value;
        } else {
          constants.Diving = false;
        }
      });
      this.debugFolder.add(constants, "Float").onChange((value) => {
        if (value) {
          constants.Float = value;
        } else {
          constants.Float = false;
        }
      });
      this.debugFolder
        .add(constants, "angle")
        .min(-360)
        .max(360)
        .step(1)
        .onChange((value) => {
          constants.angle = value;
        });

      if (constants.startExperimenting === false) {
        this.debugFolder.hide();
      }

      if (constants.startExperimenting) {
      }
      this.startExperimenting
        .add(constants, "startExperimenting")
        .onChange((value) => {
          if (value) {
            this.initialFolder.hide();
            this.debugFolder.show();
            constants.startExperimenting = true;

            constants.VSubmarine = Math.round(
              (constants.Beam / 2) *
                (constants.Beam / 2) *
                constants.length *
                Math.PI
            );

            constants.h0 = constants.Beam * 0.74;
            constants.VSurface = Math.round(
              (constants.VSubmarine * constants.h0) / constants.Beam
            );

            constants.deltaV = constants.VSubmarine - constants.VSurface;
            constants.massSubmarine = 16646909;
            constants.massTanks = 5879400;
            constants.massTotlal =
              constants.massSubmarine + constants.massTanks;
            constants.balancemass = constants.VSubmarine * constants.Ro;

            constants.massadd = constants.massTotlal - constants.balancemass;

            console.log("massadd : " + constants.massadd);
            constants.Dinternal = constants.Beam - constants.tWall;
            constants.hMax =
              this.physics.pressureMaterialForce().y /
              (constants.G * constants.Ro);
            constants.A = 1820;

            constants.V = constants.VSurface;
            constants.mass = constants.massSubmarine;
            constants.h = constants.h0;

            console.log("hmax                 " + constants.hMax);
          } else {
            constants.startExperimenting = false;
            this.initialFolder.show();
            this.debugFolder.hide();
          }
        });
    }
  }

  thrustPower() {
    if (constants.angle >= 360) {
      constants.angle = 360 % constants.angle;
    }

    this.model.rotation.x = degToRad(constants.Yangle);
    this.model.rotation.y = degToRad(constants.angle - 90);

    this.thrust = this.physics.thrustForceWithAngle(
      constants.Ro,
      constants.n,
      constants.pitch,
      constants.D,
      degToRad(constants.angle),
      degToRad(constants.Yangle)
    );
    this.velocity = Math.abs(
      this.physics.propellerVelocity(this.thrust.x, constants.power)
    );
    this.drag = this.physics.dragForceWithAngle(
      constants.Cd,
      constants.Ro,
      constants.speedZ.x,
      constants.A,
      degToRad(constants.angle),
      degToRad(constants.Yangle)
    );
    this.Xmove = this.thrust.x - this.drag.x;
    this.Ymove = this.thrust.y - this.drag.y;
    this.Zmove = this.thrust.z - this.drag.z;
    constants.resultZ.set(this.Xmove, this.Ymove, this.Zmove);
    constants.acceleration.set(
      constants.resultZ.x / constants.mass,
      constants.resultZ.y / constants.mass,
      constants.resultZ.z / constants.mass
    );
    if (
      constants.speedZ.x <= this.velocity &&
      constants.speedZ.z <= this.velocity
    ) {
      constants.speedZ.x =
        constants.speedZ.x +
        constants.acceleration.x * this.experience.time.threeDelta;
      constants.speedZ.z =
        constants.speedZ.z +
        constants.acceleration.z * this.experience.time.threeDelta;
      constants.speedZ.y =
        constants.speedZ.y +
        constants.acceleration.y * this.experience.time.threeDelta;

      if (this.model.position.z === 0) {
        this.model.position.z = -(
          0.5 *
            constants.acceleration.z *
            Math.pow(this.experience.time.threeDelta, 2) +
          constants.speedZ.z * this.experience.time.threeDelta +
          this.model.position.z
        );
      }
      if (this.model.position.x == 0) {
        this.model.position.x =
          -(
            0.5 *
              constants.acceleration.x *
              Math.pow(this.experience.time.threeDelta, 2) +
            constants.speedZ.x * this.experience.time.threeDelta
          ) + this.model.position.x;
      }
    }

    this.model.position.z =
      -(constants.speedZ.z * this.experience.time.threeDelta) +
      this.model.position.z;
    this.model.position.x =
      constants.speedZ.x * this.experience.time.threeDelta +
      this.model.position.x;
    this.model.position.y =
      -(constants.speedZ.y * this.experience.time.threeDelta) +
      this.model.position.y;
  }

  rotate() {
    this.deltaTime = this.clock.getElapsedTime() - this.lastFrameTime;
    this.lastFrameTime = this.clock.getElapsedTime();

    this.dragOnFin = this.physics.dragForceOnFin(
      1,
      5,
      constants.speedZ.z,
      constants.finRotationAngle
    );
    this.angularAcc = this.physics.angularAccelaration(
      constants.mass,
      constants.length,
      this.dragOnFin.z
    );
    this.angularSpeed = this.physics.angularSpeed(
      this.angularAcc,
      this.deltaTime
    );
    this.angularChangePerFrame = this.physics.finalAngle(
      this.angularSpeed,
      this.deltaTime
    );

    this.thrustX = this.physics.thrustOnX(
      constants.resultZ.z,
      constants.finRotationAngle
    );
    this.rotaionResult = this.thrustX.add(constants.resultZ);

    this.model.rotation.y += this.angularChangePerFrame * this.deltaTime;

    this.model.position.add(this.rotaionResult.multiplyScalar(-0.000001));
  }

  state() {
    const result =
      Math.floor(this.physics.weightForce().y) -
      Math.floor(this.physics.buoyancyForce().y);
    const acc = result / constants.mass;
    constants.resultY.y = result;
    constants.acceleration.y = acc;

    constants.speed1.y =
      constants.speed.y +
      constants.acceleration.y * this.experience.time.threeDelta;

    if (constants.resultY.y > 0) {
      this.model.position.y = -constants.speed1.y * constants.eTime;
    } else if (constants.resultY.y < 0) {
      this.model.position.y = -constants.speed1.y * constants.eTime;
    } else {
      this.model.position.y = this.model.position.y;
    }
    constants.h = constants.h0 - this.model.position.y;

    constants.speed.y = constants.speed1.y;
  }

  update() {
    this.experience.camera;
    if (constants.startExperimenting) {
      if (constants.resultY.y !== 0) {
        constants.eTime = constants.eTime + this.experience.time.threeDelta;
      }
      // console.log("TTTTTiiiimmmmmmmwmm" + constants.eTime);

      console.log(
        "Current Position" + this.model.position.x + " ",
        this.model.position.y + " ",
        this.model.position.z
      );
      console.log("result of forces on Y : " + constants.resultY.y);
      console.log(
        "result of forces on XYZ : " +
          constants.resultZ.x +
          " " +
          constants.resultZ.y +
          " " +
          constants.resultZ.z
      );
      console.log("velocity on Y : " + constants.speed1.y);
      console.log(
        "Velocity with thrust : " +
          constants.speedZ.x +
          " " +
          constants.speedZ.y +
          " " +
          constants.speedZ.z
      );

      this.state();
      if (constants.hMax < constants.h) {
        console.log(
          "Bumb ------------------------------------------------------------------------------------------"
        );
        this.experience.destroy();
      }
    }

    if (
      constants.h < constants.Beam &&
      constants.Float === true &&
      constants.Diving === false &&
      constants.h > constants.h0 - 0.4
    ) {
      if (constants.V > constants.VSurface) {
        constants.V = Math.round(constants.V * (constants.h / constants.Beam));
      }
      if (constants.mass > constants.massSubmarine) {
        constants.mass = constants.V * constants.Ro - constants.massadd;
      }
    }
    if (
      parseFloat(constants.h.toFixed(1)) ===
        parseFloat((constants.h0 - 0.4).toFixed(1)) &&
      constants.resultY.y < 0 &&
      constants.speed1.y > 100
    ) {
      constants.V = Math.round(constants.V * (constants.h / constants.Beam));
      constants.mass = constants.V * constants.Ro + constants.massadd;
      console.log(constants.V * constants.Ro);
      console.log(constants.mass);
    }
    if (
      parseFloat(constants.h.toFixed(1)) ===
        parseFloat(constants.h0.toFixed(1)) &&
      Math.round(constants.resultY.y) > 0
    ) {
      constants.V = constants.VSurface;
      constants.mass = constants.massSubmarine;
      console.log("++++++++++++++++");
    }
    if (
      parseFloat(constants.h.toFixed(1)) ===
        parseFloat(constants.h0.toFixed(1)) &&
      constants.resultY.y < 0 &&
      constants.speed1.y < 100
    ) {
      constants.V = constants.VSurface;
      constants.mass = constants.massSubmarine;
      console.log(constants.V * constants.Ro);
      console.log(constants.mass);
    }

    if (constants.Diving === true && constants.Float === false) {
      if (constants.V < constants.VSubmarine) {
        constants.V = constants.V + constants.deltaV * 0.1;
        if (Math.round(constants.mass) < constants.massTotlal) {
          constants.mass = constants.mass + constants.massTanks * 0.1;
        }
      }

      if (
        Math.round(constants.V) === constants.VSubmarine &&
        constants.mass < constants.massTotlal
      ) {
        constants.mass = constants.mass + constants.massadd * 0.1;
      }
    }

    if (
      constants.Diving === false &&
      constants.Float === false &&
      constants.startExperimenting
    ) {
      if (constants.mass > constants.balancemass && constants.resultY.y > 0) {
        constants.mass = constants.mass - constants.massadd * 0.1;
      }
      if (
        Math.round(constants.mass) < constants.massTotlal &&
        constants.resultY.y < 0
      ) {
        constants.mass = constants.mass + constants.massadd * 0.1;
      }
    }

    if (
      constants.Float === true &&
      constants.Diving === false &&
      constants.h > constants.Beam
    ) {
      if (constants.mass + constants.massadd > constants.balancemass) {
        constants.mass = constants.mass - constants.massadd * 0.05;
      }
    }

    if (constants.Go === true) {
      if (constants.n <= 10) {
        constants.n += 1;
      }
    }
    if (constants.Go === false) {
      if (constants.n > 0) {
        constants.n -= 1;
      }
      if (constants.speedZ.x > 0) {
        constants.speedZ.x -= 0.1;
      }
      if (constants.speedZ.y > 0) {
        constants.speedZ.y -= 0.1;
      }
      if (constants.speedZ.z > 0) {
        constants.speedZ.z -= 0.1;
      }
    }

    this.thrustPower();

    // this.camera.position.set(
    //   this.model.position.x,
    //   this.model.position.y + 4,
    //   this.model.position.z + 12
    // );

    //this.camera.lookAt(this.model.position);
  }

  setControls() {
    // this.controls = new Controls(this.model);
    this.controls = new Controls(this.model);
  }
}
