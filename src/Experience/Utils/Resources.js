import {
  TextureLoader,
  CubeTextureLoader,
  AudioLoader,
  AudioListener,
  PositionalAudio,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import Experience from "../Experience.js";

import EventEmitter from "./EventEmitter.js";

const AUDIO = "AUDIO";
const TEXTURE = "TEXTURE";
const GLTF_MODEL = "GLTF_MODEL";
const CUBE_TEXTURE = "CUBE_TEXTURE";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    this.experience = new Experience();
    this.camera = this.experience.camera.instance;

    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new TextureLoader();
    this.loaders.cubeTextureLoader = new CubeTextureLoader();
    this.loaders.audioLoader = new AudioLoader();

    this.listener = new AudioListener();
    this.camera.add(this.listener);
  }

  startLoading() {
    /* Load each source */
    for (const source of this.sources) {
      if (source.type === GLTF_MODEL) {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === TEXTURE) {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === CUBE_TEXTURE) {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === AUDIO) {
        const audio = new PositionalAudio(this.listener);

        this.loaders.audioLoader.load(source.path, (buffer) => {
          audio.loop = true;
          audio.setBuffer(buffer);
          audio.setRefDistance(20);
          audio.setVolume(source.volume ?? 1);

          audio.play();

          this.sourceLoaded(source, audio);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
