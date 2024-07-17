const path = "src/static/";

const audiosPath = path + "audios/";
const modelsPath = path + "models/";
const texturesPath = path + "textures/";

const AUDIO = "AUDIO";
const TEXTURE = "TEXTURE";
const GLTF_MODEL = "GLTF_MODEL";
const CUBE_TEXTURE = "CUBE_TEXTURE";

const sources = [
  /* Textures */
  {
    type: TEXTURE,
    name: "waterNormalsTexture",
    path: texturesPath + "waternormals.jpg",
  },

  /* Models */
  {
    type: GLTF_MODEL,
    name: "submarineModel",
    path: modelsPath + "ohio-class_submarine_ssbn.glb",
  },
  {
    type: GLTF_MODEL,
    name: "seagullsModel",
    path: modelsPath + "seagulls_animated.glb",
  },
  {
    type: GLTF_MODEL,
    name: "helicopterModel",
    path: modelsPath + "helicopter.glb",
  },

  /* Audios */
  {
    volume: 0.5,
    type: AUDIO,
    name: "oceanAudio",
    path: audiosPath + "ocean.mp3",
  },
  {
    volume: 0.2,
    type: AUDIO,
    name: "submarineAudio",
    path: audiosPath + "submarine.mp3",
  },
  {
    volume: 0.1,
    type: AUDIO,
    name: "seagullsAudio",
    path: audiosPath + "seagulls.mp3",
  },
  {
    volume: 0.6,
    type: AUDIO,
    name: "helicopterAudio",
    path: audiosPath + "helicopter.mp3",
  },
];

export default sources;
