import { Mesh, Clock } from "three";

import Experience from "../Experience.js";

import Physics from "../Physics/Physics.js";
import { constants } from "../Physics/constants.js";
import Controls from "../Controls/Controls.js";
import { degToRad } from "three/src/math/MathUtils.js";
import { cos } from "three/examples/jsm/nodes/Nodes.js";

export default class Submarine {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
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
    this.submarineMovements();
    this.setControls();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.1, 0.1, 0.1);

    // this.audio.setVolume(0.7);
    // console.log(this.audio.getVolume());
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
        .add(this.model.rotation, "z")
        .min(0)
        .max(360)
        .step(0.01)
        .onChange((value)=>
        this.model.rotation.z=degToRad(-1*value))
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
        .add(constants, "finAngle")
        .min(-360)
        .max(360)
        .step(1)
        .onChange((value) => {
          constants.finAngle = value;
        });
      this.debugFolder.add(constants, "Go").onChange((value) => {
        if (value) {
          constants.Go = value;
        } else {
          constants.Go = false;
        }
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

            constants.VSubmarine =
              (constants.Beam / 2) *
              (constants.Beam / 2) *
              constants.length *
              Math.PI;
            constants.V =
              (constants.massSubmarine - constants.massSubmarine * 0.12) /
              constants.Ro;
            constants.massSubmarine = constants.VSubmarine * constants.Ro;
            constants.massTanks = constants.massSubmarine * 0.12;
            constants.massTotlal = Math.round(
              constants.massSubmarine - constants.massTanks
            );
            constants.mass = constants.V * constants.Ro;
            constants.VTanks = constants.massTanks / constants.Ro;
            constants.VTotlal = constants.VSubmarine - constants.VTanks;
            constants.massCurrent = constants.VCurrent * constants.Ro;
            constants.VCurrent =
              (constants.massSubmarine - constants.massSubmarine * 0.12) /
              constants.Ro;
            // console.log(constants.massTotlal)
            // console.log(constants.mass)
            // console.log(constants.VTotlal/constants.massTotlal)
            // console.log(constants.VSubmarine)
            // console.log(constants.VTanks)
            // console.log(constants.V)
          } else {
            constants.startExperimenting = false;
            this.initialFolder.show();
            this.debugFolder.hide();
          }
        });
    }
  }

  submarineMovements() {
    document.addEventListener("keydown", (event) => {
      this.elapsedTime = this.clock.getElapsedTime();

      console.log(this.elapsedTime);

      if (event.key === "w" || event.key === "W") {
      } else if (event.key === "a" || event.key === "A") {
        this.model.rotation.y += 0.005;
        this.model.position.x -= 0.005;
      } else if (event.key === "s" || event.key === "S") {
        this.model.position.z += 0.1;
      } else if (event.key === "d" || event.key === "D") {
        this.model.rotation.y -= 0.005;
        this.model.position.x += 0.005;
      }
    });
  }

  thrustPower(){
  if(constants.angle>=360){
    constants.angle=360%constants.angle
  }
  //constants.angle+=0.1
    // if(constants.angle>=360){
    //   constants.angle=0;
    // }
     constants.rotationAccelerationOnXZ=this.physics.rotationAccelerationOnXZ(constants.Cd,constants.Ro,constants.speedZ.x,
       constants.finArea,constants.finAngle,constants.mass,constants.length)
       constants.rotationSpeedXZ=constants.rotationAccelerationOnXZ*this.experience.time.threeDelta;
       console.log(constants.rotationSpeedXZ);
       constants.angle=constants.rotationSpeedXZ*this.experience.time.threeDelta;
      this.model.rotation.y=degToRad(constants.angle-90);
      console.log("terminal velocity"+ this.velocity);
      this.thrust = this.physics.thrustForceWithAngle(constants.Ro, constants.n, constants.pitch, constants.D,degToRad(constants.angle));
      this.velocity = Math.abs(this.physics.propellerVelocity(this.thrust.x, constants.power));
    this.drag = this.physics.dragForceWithAngle(constants.Cd, constants.Ro, constants.speedZ.x, constants.A,degToRad(constants.angle));
    this.Xmove=this.thrust.x-this.drag.x;
    this.Ymove=this.thrust.y-this.drag.y;
    this.Zmove=this.thrust.z-this.drag.z
    constants.resultZ.set(this.Xmove, 0, this.Zmove);
    constants.acceleration.set(constants.resultZ.x/constants.mass, 0, constants.resultZ.z / constants.mass);
    if(constants.speedZ.x <= this.velocity && constants.speedZ.z <= this.velocity ){
      //console.log('speed before: ' + constants.speedZ.z);
      constants.speedZ.x = constants.speedZ.x + constants.acceleration.x * this.experience.time.threeDelta ;
    constants.speedZ.z = constants.speedZ.z + constants.acceleration.z * this.experience.time.threeDelta ;
      //console.log('speed after: ' + constants.speedZ.z);

       if(this.model.position.z === 0){
         this.model.position.z = -(0.5 * constants.acceleration.z * Math.pow(this.experience.time.threeDelta, 2)
                                   + constants.speedZ.z * this.experience.time.threeDelta + this.model.position.z);
       }
       if(this.model.position.x==0){
       this.model.position.x = -(0.5 * constants.acceleration.x * Math.pow(this.experience.time.threeDelta, 2)
                                   + constants.speedZ.x * this.experience.time.threeDelta) + this.model.position.x;
       }

    }
    //console.log('reached');
    this.model.position.z = -(constants.speedZ.z * this.experience.time.threeDelta) + this.model.position.z;    
    this.model.position.x = (constants.speedZ.x * this.experience.time.threeDelta) + this.model.position.x;
    console.log("x  " + this.model.position.x +"     "  + "     " +"z   " + this.model.position.z);
    }

  state() {
    constants.resultY.set(
      0,
      this.physics.weightForce().y - this.physics.buoyancyForce().y,
      0
    );
    constants.acceleration.set(0, constants.resultY.y / constants.mass, 0);

    //  console.log('weight' + this.physics.weightForce().y  )
    //  console.log('buoyancy' + this.physics.buoyancyForce().y)

    constants.speed1.y =
      constants.speed.y +
      constants.acceleration.y * this.clock.getElapsedTime();

    //  console.log('res : ' + constants.resultY.y)
    //  console.log('acc : ' + constants.acceleration.y)
    //  console.log('speed : ' + constants.speed1.y);

    if (constants.resultY.y > 0) {
      this.model.position.y = this.model.position.y - constants.speed1.y;
      console.log("posssssssssssssssssssss" + this.model.position.y);
    } else if (constants.resultY.y < 0) {
      this.model.position.y = this.model.position.y - constants.speed1.y;
      console.log(this.model.position.y);
      // if(this.model.position.y)
      // console.log(this.model.position.y )
    } else {
      this.model.position.y = this.model.position.y;
    }
    constants.speed.y = constants.speed1.y;
  }

  update() {
    this.experience.camera;
    if (constants.Diving === true && constants.Float === false) {
      console.log("Diving");
      if (true) {
        if (constants.massTotlal > constants.mass) {
          //  constants.mass+=0.2
          constants.mass = (constants.V + 0.001) * constants.Ro;
          if (constants.VTotlal > constants.V) {
            constants.V += 0.0005;
          }

          //  console.log('Divvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvving')
          //  console.log('masssssssssssssssss'+constants.mass)
          //  console.log('vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv'+constants.V)
          this.state();
        }
        console.log("haha" + constants.resultY.y);
      }
      // if(mass < 1500000)
      // constants.mass += 100000
      // if(V< 20000){
      //   constants.V +=1000
      // }
    }
    if (constants.Diving === false && constants.Float === false) {
      //console.log('abdmass' + constants.resultY.y)
      if (constants.resultY.y > 0) {
        console.log("NotDiving");
        if (constants.mass > constants.massCurrent) {
          constants.mass = (constants.V - 0.0001) * constants.Ro;
          if (constants.VSubmarine > constants.V) {
            constants.V = (constants.mass + 0.01) / constants.Ro;
            // constants.V+=  0.0001
            console.log("NotttttttttttttttttttttttttDiving");
            this.state();
            console.log("ressssssssssssss" + constants.resultY.y);
          }
        }
        // constants.mass= constants.V*constants.Ro
        constants.resultY.y = Math.round(constants.resultY.y);
        console.log("floor" + constants.resultY.y);
        console.log("Totlal" + constants.VTotlal);
        console.log(constants.V);
      }

      if (constants.resultY.y < 0) {
        // if(constants.massCurrent > constants.mass){
        //   //  constants.mass+=0.2
        //   constants.mass= (constants.V+0.001)*constants.Ro
        //   this.state();
        // }
        // constants.V= constants.mass/constants.Ro
      }

      // console.log('resulty'+constants.resultY.y)
      // constants.resultY.y= Math.round(constants.resultY.y)
    }
    if (constants.Float === true && constants.Diving === false) {
      if (true) {
        //console.log('abdmass' + constants.V)
        console.log("abdVV" + constants.VTotlal);
        if (constants.V < constants.VTotlal) {
          //  constants.mass+=0.2
          constants.V = (constants.mass + 0.1) / constants.Ro;
          console.log("Divvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvving");
          console.log("masssssssssssssssss" + constants.mass);
          console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv" + constants.V);
          this.state();
        }
        constants.mass = constants.V * constants.Ro;

        //  constants.V= constants.mass/constants.Ro
      }
    }
    // if(constants.Float===false && constants.Diving === false){
    //   if(Math.round(constants.resultY.y) !==0)
    //   if(constants.massTotlal > constants.mass){
    //     constants.mass= (constants.V+0.001)*constants.Ro

    //     console.log('Nottttttttttttttttttfloattttttttttttttttttttttt')
    //     this.state()

    //   }
    // }

    // if(this.model.position.y >0.3){

    //   this.state()
    // }

    if (constants.Go === true) {
      this.thrustPower();
    }
  }

  setControls() {
    this.controls = new Controls(this.model);
  }
}
