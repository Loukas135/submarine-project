import * as THREE from "three";
import { constants } from "./constants";

export default class Physics {
  constructor() {}

  weightForce() {
    this.weight = constants.mass * constants.G;
    return new THREE.Vector3(0, this.weight, 0);
  }

  buoyancyForce() {
    this.buoyancy = constants.Ro * constants.G * constants.V;
    return new THREE.Vector3(0, this.buoyancy, 0);
  }

  thrustForce(Ro, n, pitch, D) {
    this.thrust = Ro * n * Math.pow(pitch, 2) * Math.pow(D, 4);
    return new THREE.Vector3(this.thrust, 0, 0);
  }

  propellerVelocity(T, P) {
    this.velocity = P / T;
    return this.velocity;
  }

  dragForce(Cd, Ro, velocity, A) {
    this.drag = 0.5 * Cd * Ro * velocity * velocity * A;
    return new THREE.Vector3(this.drag, 0, 0);
  }

  dragForceOnFin(Cd, A, v, finRotationAngle){
    this.finDrag = 0.5 * Cd * A * Math.pow(v, 2) * Math.cos(finRotationAngle);
    return new THREE.Vector3(0, 0, this.finDrag);
  }

  angularAccelaration(m, l, F){
    this.angAccelaration = (2 / 3) * ((m * l) / F)
    // return new THREE.Vector3(this.angAccelaration, 0, 0);
    return this.angAccelaration;
  }

  angularSpeed(angAccelaration, timeForFrame){
    this.angSpeed = angAccelaration * timeForFrame;
    // return new THREE.Vector3(this.angSpeed, 0, 0);
    return this.angSpeed;
  }

  finalAngle(angSpeed, timeForFrame){
    this.angle = angSpeed * timeForFrame;
    // return new THREE.Vector3(this.angle, 0, 0);
    return this.angle;
  }

  thrustOnX(F, finRotationAngle){
    this.Fx = F * Math.sin(finRotationAngle);
    return new THREE.Vector3(this.Fx, 0, 0);
  }

  thrustOnZ(F, finRotationAngle){
    this.Fz = F * Math.cos(finRotationAngle);
    return new THREE.Vector3(0, 0, this.Fz);
  }

  angularAccelaration(F, l, I) {
    // Torque = F * l (perpendicular distance)
    const torque = F * l;
    // Angular acceleration = Torque / Moment of Inertia
    const angAccelaration = torque / I;
    return angAccelaration;  // Scalar, not a vector
  }
}
