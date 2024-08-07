import { Vector3 } from "three";

export const constants = {
  startExperimenting: false,
  Diving: false,
  Float: false,
  Go: false,
  G: 9.8,
  Beam: 13,
  length: 170,
  Ro: 997,
  massSubmarine: 16764000,
  mass: 16764000,
  massTanks: 2011680,
  massTotlal: 16764000 + 2011680,
  V: 16814,
  VTanks: 2000,
  VTotlal: 22500 - 2000,
  VSubmarine: 22500,
  VCurrent: 0,
  massCurrent: 0,
  speed: new Vector3(0, 0, 0),
  speed1: new Vector3(0, 0, 0),
  acceleration: new Vector3(0, 0, 0),
  resultY: new Vector3(0, 0, 0),
  /* Thrust */
  power: 150000,
  n: 1,
  D: 2,
  pitch: 1,
  resultZ: new Vector3(0, 0, 0),
  speedZ: new Vector3(0, 0, 0),
  /* */
  /* Drag */
  Cd: 0.82,
  A: 2,
  /* */
};
