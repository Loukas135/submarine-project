const path = "src/static/";

const texturesPath = path + "textures/";
const soundsPath = path + "sounds/";
const modelsPath = path + "models/";

const sources = [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      texturesPath + "environmentMap/px.jpg",
      texturesPath + "environmentMap/nx.jpg",
      texturesPath + "environmentMap/py.jpg",
      texturesPath + "environmentMap/ny.jpg",
      texturesPath + "environmentMap/pz.jpg",
      texturesPath + "environmentMap/nz.jpg",
    ],
  },
  {
    name: "skyboxTextures",
    type: "cubeTexture",
    path: [
      texturesPath + "skybox/left.jpg",
      texturesPath + "skybox/right.jpg",
      texturesPath + "skybox/top.jpg",
      texturesPath + "skybox/bottom.jpg",
      texturesPath + "skybox/back.jpg",
      texturesPath + "skybox/front.jpg",
    ],
  },
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
    name: "easterIslandModel",
    type: "gltfModel",
    path: modelsPath + "easter_island.glb",
  },
  {
    name: "mountFujiVolcanoModel",
    type: "gltfModel",
    path: modelsPath + "mount_fuji_volcano_japan.glb",
  },
  {
    name: "sanSalvadorIslandModel",
    type: "gltfModel",
    path: modelsPath + "san_salvador_island.glb",
  },
  {
    name: "gunungMountAgungBaliModel",
    type: "gltfModel",
    path: modelsPath + "gunung_mount_agung_bali.glb",
  },
];

export default sources;
