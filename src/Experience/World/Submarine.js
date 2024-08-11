import { Mesh, Clock } from "three";
import * as THREE from "three";

import Experience from "../Experience.js";

import Physics from "../Physics/Physics.js";
import { constants } from "../Physics/constants.js";
import Controls from "../Controls/Controls.js";
import { degToRad } from "three/src/math/MathUtils.js";
import { cos, abs, ceil, round } from "three/examples/jsm/nodes/Nodes.js";

export default class Submarine {
  constructor() {
    this.lastFrameTime = 0;
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
        .step(0.001)
        .onChange((value) => {
          constants.angle = value;
        });
        this.debugFolder
        .add(constants, "Yangle")
        .min(-90)
        .max(90)
        .step(0.001)
        .onChange((value) => {
          constants.Yangle = value;
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
          
            constants.VSubmarine=Math.round((constants.Beam/2)*(constants.Beam/2)*constants.length*Math.PI)
            
          
            constants.h0= constants.Beam*0.74
            constants.VSurface= Math.round(constants.VSubmarine*constants.h0/constants.Beam)
          
            constants.deltaV= constants.VSubmarine- constants.VSurface
            constants.massSubmarine= 16646909
            //constants.massTotlal=constants.massSubmarine+constants.massTanks;
            constants.massTanks= 5849499
            constants.massTotlal=  constants.massSubmarine+constants.massTanks
            constants.balancemass= constants.VSubmarine*constants.Ro

constants.massadd= constants.massTotlal- constants.balancemass
        
            
              
            
            constants.hMax= 4000
            constants.A= 1820
  
            constants.V= constants.VSurface
            constants.mass= constants.massSubmarine
            constants.h= constants.h0
           
            // console.log('++++++++++++++++++++++++++++++++++++++++++++')
         
            console.log('mass0                 '+ (constants.massadd))
            // console.log('VVV                 '+ (constants.massadd ))
            // console.log('mass0                 '+ (constants.massTotlal ))
            // console.log('V0                    '+((constants.massSubmarine )- (constants.VSubmarine*constants.Ro)))
            // console.log(constants.mass-(constants.Ro*constants.V) - (constants.Ro*constants.h*constants.A))
            
            
            //  console.log('++++++++++++++++++++++++++++++++++++++++++++')
              
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
    //  constants.rotationAccelerationOnXZ=this.physics.rotationAccelerationOnXZ(constants.Cd,constants.Ro,constants.speedZ.x,
    //    constants.finArea,constants.finAngle,constants.mass,constants.length)
    //    constants.rotationSpeedXZ=constants.rotationAccelerationOnXZ*this.experience.time.threeDelta;
    //    console.log(constants.rotationSpeedXZ);
    //    constants.angle=constants.rotationSpeedXZ*this.experience.time.threeDelta;
    this.model.rotation.x=degToRad(constants.Yangle)
      this.model.rotation.y=degToRad(constants.angle-90);
      console.log("terminal velocity"+ this.velocity);
      this.thrust = this.physics.thrustForceWithAngle(constants.Ro, constants.n, constants.pitch, constants.D,degToRad(constants.angle),degToRad(constants.Yangle));
      this.velocity = Math.abs(this.physics.propellerVelocity(this.thrust.x, constants.power));
    this.drag = this.physics.dragForceWithAngle(constants.Cd, constants.Ro, constants.speedZ.x, constants.A,degToRad(constants.angle),degToRad(constants.Yangle));
    this.Xmove=this.thrust.x-this.drag.x;
    this.Ymove=this.thrust.y-this.drag.y;
    this.Zmove=this.thrust.z-this.drag.z
    constants.resultZ.set(this.Xmove, this.Ymove, this.Zmove);
    constants.acceleration.set(constants.resultZ.x/constants.mass, constants.resultZ.y/constants.mass, constants.resultZ.z / constants.mass);
    if(constants.speedZ.x <= this.velocity && constants.speedZ.z <= this.velocity ){
      //console.log('speed before: ' + constants.speedZ.z);
      constants.speedZ.x = constants.speedZ.x + constants.acceleration.x * this.experience.time.threeDelta ;
    constants.speedZ.z = constants.speedZ.z + constants.acceleration.z * this.experience.time.threeDelta ;
    constants.speedZ.y = constants.speedZ.y + constants.acceleration.y * this.experience.time.threeDelta;
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
    this.model.position.y = -(constants.speedZ.y * this.experience.time.threeDelta) + this.model.position.y;
    console.log("y  " + this.model.position.y +"     "  + "     " +"z   " + this.model.position.z);
    }

  


  rotate(){
    this.deltaTime = this.clock.getElapsedTime() - this.lastFrameTime;
    this.lastFrameTime = this.clock.getElapsedTime();

    this.dragOnFin = this.physics.dragForceOnFin(1, 5, constants.speedZ.z, constants.finRotationAngle);


    //this.angularAccelaration = this.physics.angularAccelaration(constants.mass, constants.length, this.dragOnFin.z);
    this.angularAcc = this.physics.angularAccelaration(constants.mass, constants.length, this.dragOnFin.z);
    //this.angularSpeed = this.physics.angularSpeed(this.angularAccelaration.x, this.deltaTime);
    this.angularSpeed = this.physics.angularSpeed(this.angularAcc, this.deltaTime);
    this.angularChangePerFrame = this.physics.finalAngle(this.angularSpeed, this.deltaTime);

    this.thrustX = this.physics.thrustOnX(constants.resultZ.z, constants.finRotationAngle);
    this.rotaionResult = this.thrustX.add(constants.resultZ);

    //console.log(constants.Fz);
    //console.log(constants.Fx);
    //console.log(this.rotaionResult);

    this.model.rotation.y += this.angularChangePerFrame * this.deltaTime
    
    console.log(this.model.rotation.y)
    this.model.position.add(this.rotaionResult.multiplyScalar(-0.000001));
    
    //this.model.position.x -= (this.angularSpeed.x * 0.000001 * this.deltaTime);

    // console.log('angularAccelaration ' + this.angularAccelaration.x * 0.0000001);
    // console.log('angularSpeed ' + this.angularSpeed.x * 0.000000001);
    // console.log('angularChangePerFrame ' + this.angularChangePerFrame.x * 0.000000001);
    // console.log('delta time ' + this.deltaTime);
  }

  state() {
    const result=  Math.floor(this.physics.weightForce().y ) -  Math.floor (this.physics.buoyancyForce().y)
    const acc= result/constants.mass
      constants.resultY.y=result ;
      constants.acceleration.y= acc ;
     
     constants.speed1.y=constants.speed.y+ (constants.acceleration.y*this.experience.time.threeDelta*100000);
    //  console.log('res : '+constants.resultY.y)
    //  console.log('speed:' + constants.speed1.y )
 
     if (constants.resultY.y > 0 ) {
     this.model.position.y= -constants.speed1.y*this.experience.time.threeDelta
    //  console.log('posssssssssssssssssssss'+this.model.position.y)
    //  console.log('destanceeeeeeeeeeeeeeee'+ -constants.speed1.y*this.clock.getElapsedTime() )
     } else if (constants.resultY.y < 0 ) {  
       this.model.position.y= -constants.speed1.y*this.experience.time.threeDelta 
      //  console.log('posssssssssssssssssssss'+this.model.position.y)
      //  console.log('destanceeeeeeeeeeeeeeee'+ -constants.speed1.y*this.clock.getElapsedTime() )
       
     } else {
       this.model.position.y = this.model.position.y;
     }
     constants.h=constants.h0 -this.model.position.y
 
     constants.speed.y=constants.speed1.y
   }

  update() {
    this.experience.camera;
    if(constants.startExperimenting){
      this.state();
      // console.log('&&&&&&&&&&&&&&&&&hb'+(parseFloat(constants.h.toFixed(1))))

    }

    if(constants.h< constants.Beam  && constants.Float===true && constants.Diving === false  && constants.h> (constants.h0-0.4) ){

          //  console.log(constants.resultY.y)  
          if(constants.V>constants.VSurface){
            constants.V=Math.round(constants.V*(constants.h/constants.Beam))

            // constants.V=Math.round(constants.V - ((constants.deltaV+((0.2/constants.Beam)*constants.VSubmarine))*0.1))
           }
            if ( constants.mass> constants.massSubmarine ) {
              // constants.mass= Math.round(constants.mass) -((constants.massTanks-constants.massadd)*0.11)
              constants.mass= (constants.V*constants.Ro)-constants.massadd
            }
             
      
      //       console.log(constants.VSurface)
      
    }
    if((parseFloat(constants.h.toFixed(1)))=== (parseFloat((constants.h0-0.4).toFixed(1))) && constants.resultY.y<0){
      constants.V=Math.round(constants.V*(constants.h/constants.Beam))
      // constants.V=constants.VSurface
      constants.mass=(constants.V*constants.Ro)+constants.massadd
      console.log((constants.V*constants.Ro ) )
      console.log((constants.mass) )

    }
    if((parseFloat(constants.h.toFixed(1)))=== (parseFloat((constants.h0).toFixed(1))) && (Math.round(constants.resultY.y))>0){
      constants.V=constants.VSurface
      constants.mass=constants.massSubmarine
      console.log('++++++++++++++++' )

    }

    if(constants.Diving===true && constants.Float===false){
      // console.log('VVVVV++++++'+(constants.mass))
      // console.log('VSubmarine++++++'+((constants.massSubmarine+constants.massTanks)))
     
            if(constants.V < constants.VSubmarine ){
                
                constants.V = constants.V + (constants.deltaV*0.1)
                // console.log('V++') 
                // console.log(Math.floor(constants.V*constants.Ro*constants.G))  
                if(Math.round(constants.mass) < (constants.massTotlal)){
                  constants.mass = constants.mass + ((constants.massTanks)*0.1)
                  // console.log('m++') 
                  // console.log(Math.floor(constants.mass*constants.G)) 
                }
                  
                }
               
                if(Math.round(constants.V) === constants.VSubmarine && constants.mass < (constants.massTotlal) ){
                  constants.mass = constants.mass + ((constants.massadd)*0.1)
                  // console.log('+++++massss+++++++++++'+constants.mass)
                  // console.log('+++++massss+++++++++++'+(constants.mass+constants.massadd))
                }
                // this.state()
                // if((constants.mass<constants.massTotlal)  && constants.resultY.y===0){
                //   constants.mass = constants.mass +1
                // }
             
                // console.log('hhh++++++'+(constants.h))

        
      

    }
   
      
      
     
    
    if(constants.Diving===false && constants.Float===false&& constants.startExperimenting){
      
      if(constants.mass> constants.balancemass && constants.resultY.y >0){
        constants.mass= constants.mass- (constants.massadd*0.1)
              }
              if(Math.round(constants.mass) < (constants.massTotlal) && constants.resultY.y<0 ){
                constants.mass= constants.mass+ (constants.massadd*0.1)
                      }
  
    
          

        }
        
          
         
      
      
   
        
        if(constants.Float===true && constants.Diving === false&& constants.h>constants.Beam ){
      if((constants.mass+ constants.massadd)> (constants.balancemass) ){
        // console.log('abdmass'+(constants.mass- constants.massTanks))
        // console.log('abdsub'+constants.massSubmarine)
        constants.mass= constants.mass- ((constants.massadd)*0.05)
        //  constants.h>= constants.h0   
        }
      }
       
      
        
    
  

    if (constants.Go === true) {
      if(constants.n<=10){
        constants.n+=1;
      }
    }
    this.thrustPower();
  }

  setControls() {
    this.controls = new Controls(this.model);
  }
}
