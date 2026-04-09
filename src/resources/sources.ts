import type { Source } from "base-experience";

const sources: Source[] = [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/px.jpg",
      "textures/environmentMap/nx.jpg",
      "textures/environmentMap/py.jpg",
      "textures/environmentMap/ny.jpg",
      "textures/environmentMap/pz.jpg",
      "textures/environmentMap/nz.jpg",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "textures/dirt/color.jpg",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "textures/dirt/normal.jpg",
  },
  {
    name: "foxModel",
    type: "gltfModel",
    path: "models/Fox/glTF/Fox.gltf",
  },
  {
    name: "mushroomModel",
    type: "gltfModel",
    path: "models/champignon/champginon.gltf",
  },
  {
    name: "mushroomCollider",
    type: "gltfModel",
    path: "models/champignon/champginon.gltf",
  },
  {
    name: "levelDesignModel",
    type: "gltfModel",
    path: "models/LD/blocking.glb"
  },
  {
    name: "tree_1",
    type: "gltfModel",
    path: "models/vegetation/tree_1.glb",
  },
  {
    name: "leafs_texture",
    type: "texture",
    path: "textures/vegetation/leaves.jpg",
  },
];

export default sources;