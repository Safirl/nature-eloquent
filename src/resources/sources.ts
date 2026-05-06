import type { Source } from "@plugins/baseExperience";

const sources: Source[] = [
	{
		name: "environmentMapTexture",
		type: "cubeTexture",
		path: [
			"textures/environmentMap/1/px.png",
			"textures/environmentMap/1/nx.png",
			"textures/environmentMap/1/py.png",
			"textures/environmentMap/1/ny.png",
			"textures/environmentMap/1/pz.png",
			"textures/environmentMap/1/nz.png",
		],
	},
	{
		name: "environmentMapTexture1",
		type: "cubeTexture",
		path: [
			"textures/environmentMap/2/px.png",
			"textures/environmentMap/2/nx.png",
			"textures/environmentMap/2/py.png",
			"textures/environmentMap/2/ny.png",
			"textures/environmentMap/2/pz.png",
			"textures/environmentMap/2/nz.png",
		],
	},
	{
		name: "dirtColorTexture",
		type: "texture",
		path: "textures/dirt/color.jpg",
	},
	{
		name: "dirtNormalTexture",
		type: "texture",
		path: "textures/dirt/normal.jpg",
	},
	{
		name: "grassColorTexture",
		type: "texture",
		path: "textures/grass/color.png",
	},
	{
		name: "grassAlphaTexture",
		type: "texture",
		path: "textures/grass/alpha.png",
	},
	{
		name: "foxModel",
		type: "gltfModel",
		path: "models/Fox/glTF/Fox.gltf",
	},
	{
		name: "pineModel",
		type: "gltfModel",
		path: "models/pine/glb/PineeTree.glb",
	},
	{
		name: "layoutModel",
		type: "gltfModel",
		path: "models/layout/Layout.glb",
	},
	{
		name: "mushroomModel",
		type: "gltfModel",
		path: "models/champignon/champginon.gltf",
	},
	{
		name: "mushroomPaintedModel",
		type: "gltfModel",
		path: "models/champignon/1/champignon-painted.gltf",
	},
	{
		name: "mushroomCollider",
		type: "gltfModel",
		path: "models/champignon/champginon.gltf",
	},
	{
		name: "levelDesignModel",
		type: "gltfModel",
		path: "models/LD/blocking.glb",
	},

	/**
	 * Menu assets
	 */
	{
		name: "herbarium",
		type: "gltfModel",
		path: "models/Menu/herbarium.glb",
	},
	{
		name: "mushroom",
		type: "texture",
		path: "textures/stickers/mushroom.png",
	},
	{
		name: "mushroom2",
		type: "texture",
		path: "textures/stickers/mushroom2.png",
	},
];

export default sources;
