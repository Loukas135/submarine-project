const path = "src/static/";

const texturesPath = path + "textures/";
const modelsPath = path + "models/";

const sources = [
  {
    name: "submarineModel",
    type: "gltfModel",
    path: modelsPath + "ohio-class_submarine_ssbn.glb",
  },
  {
    name: "seagullsModel",
    type: "gltfModel",
    path: modelsPath + "seagulls_animated.glb",
  },
  {
    name: "waterNormalsTexture",
    type: "texture",
    path: texturesPath + "waternormals.jpg",
  },
];

export default sources;
