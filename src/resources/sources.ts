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
		path: "models/layout/path_layout.glb",
	},
	{
		name: "forestModel",
		type: "gltfModel",
		path: "models/layout/Terrain12.glb",
	},
	{
		name: "invisibleWallModel",
		type: "gltfModel",
		path: "models/layout/blockingForestModel.glb",
	},
	{
		name: "mushroomModel",
		type: "gltfModel",
		path: "models/champignon/champginon.gltf",
	},
	{
		name: "brambleModel",
		type: "gltfModel",
		path: "models/bramble/bramble.glb",
	},
	{
		name: "asterModel",
		type: "gltfModel",
		path: "models/aster/aster.glb",
	},
	{
		name: "edelweissModel",
		type: "gltfModel",
		path: "models/edelweiss/edelweiss_grass.glb",
	},
	{
		name: "tRexModel",
		type: "gltfModel",
		path: "models/t-rex/t-rex.glb",
	},
	{
		name: "fernModel",
		type: "gltfModel",
		path: "models/fern/fern.glb",
	},
	{
		name: "darkFlowerModel",
		type: "gltfModel",
		path: "models/darkFlower/dark-flower.glb",
	},
	{
		name: "mushroomPaintedModel",
		type: "gltfModel",
		path: "models/champignon/1/champignon-painted.gltf",
	},
	{
		name: "mushroomModel",
		type: "gltfModel",
		path: "models/mushroom/mushroomModel.glb",
	},
	{
		name: "vineModel",
		type: "gltfModel",
		path: "models/vine/vine.glb",
	},
	{
		name: "postcardModel",
		type: "gltfModel",
		path: "models/postcard/postcard.glb",
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
	{
		name: "grassClumpModel",
		type: "gltfModel",
		path: "models/grass/grassClump.glb",
	},
	{
		name: "buttercupModel",
		type: "gltfModel",
		path: "models/buttercup/bouton-or_grass.glb",
	},
	{
		name: "giantButtercupModel",
		type: "gltfModel",
		path: "models/buttercup/bouton-or_grass_bigger.glb",
	},
	{
		name: "irisModel",
		type: "gltfModel",
		path: "models/iris/iris.glb",
	},
	{
		name: "giantIrisModel",
		type: "gltfModel",
		path: "models/iris/iris_bigger.glb",
	},
	{
		name: "lysModel",
		type: "gltfModel",
		path: "models/lys/lys.glb",
	},
	{
		name: "giantLysModel",
		type: "gltfModel",
		path: "models/lys/lys_bigger.glb",
	},

	/**
	 * Menu assets
	 */
	{
		name: "herbarium",
		type: "gltfModel",
		path: "models/Menu/herbarium.glb",
	},

	/**
	 * Menu Stickers
	 */
	{
		name: "edeilweiss_flower",
		type: "texture",
		path: "textures/stickers/edeilweiss_flower.png",
	},
	{
		name: "edeilweiss_flower_shadow",
		type: "texture",
		path: "textures/stickers/edeilweiss_flower_shadow.png",
	},
	{
		name: "buttercup_flower",
		type: "texture",
		path: "textures/stickers/buttercup_flower.png",
	},
	{
		name: "buttercup_flower_shadow",
		type: "texture",
		path: "textures/stickers/buttercup_flower_shadow.png",
	},
	{
		name: "iris_stem_flower",
		type: "texture",
		path: "textures/stickers/iris_stem_flower.png",
	},
	{
		name: "iris_stem_flower_shadow",
		type: "texture",
		path: "textures/stickers/iris_stem_flower_shadow.png",
	},
	{
		name: "buttercup_stem_flower",
		type: "texture",
		path: "textures/stickers/buttercup_stem_flower.png",
	},
	{
		name: "buttercup_stem_flower_shadow",
		type: "texture",
		path: "textures/stickers/buttercup_stem_flower_shadow.png",
	},
	{
		name: "iris_flower",
		type: "texture",
		path: "textures/stickers/iris_flower.png",
	},
	{
		name: "iris_flower_shadow",
		type: "texture",
		path: "textures/stickers/iris_flower_shadow.png",
	},
	{
		name: "lys_flower",
		type: "texture",
		path: "textures/stickers/lys_flower.png",
	},
	{
		name: "lys_flower_shadow",
		type: "texture",
		path: "textures/stickers/lys_flower_shadow.png",
	},
	{
		name: "lys_stem_flower",
		type: "texture",
		path: "textures/stickers/lys_flower_stem.png",
	},
	{
		name: "lys_stem_flower_shadow",
		type: "texture",
		path: "textures/stickers/lys_flower_stem_shadow.png",
	},
	{
		name: "butterfly",
		type: "texture",
		path: "textures/stickers/butterfly.png",
	},
	{
		name: "dino",
		type: "texture",
		path: "textures/stickers/dino.png",
	},
	{
		name: "postcard",
		type: "texture",
		path: "textures/stickers/postcard.png",
	},
	{
		name: "butterfly_shadow",
		type: "texture",
		path: "textures/stickers/butterfly_shadow.png",
	},
	{
		name: "grass",
		type: "texture",
		path: "textures/stickers/grass.png",
	},
	{
		name: "grass_shadow",
		type: "texture",
		path: "textures/stickers/grass_shadow.png",
	},
	{
		name: "ivy_leaf",
		type: "texture",
		path: "textures/stickers/ivy_leaf.png",
	},
	{
		name: "ivy_leaf_shadow",
		type: "texture",
		path: "textures/stickers/ivy_leaf_shadow.png",
	},
	{
		name: "mushroom",
		type: "texture",
		path: "textures/stickers/mushroom.png",
	},
	{
		name: "mushroom_shadow",
		type: "texture",
		path: "textures/stickers/mushroom_shadow.png",
	},
	{
		name: "neroli_leaves",
		type: "texture",
		path: "textures/stickers/neroli_leaves.png",
	},
	{
		name: "neroli_leaves_shadow",
		type: "texture",
		path: "textures/stickers/neroli_leaves_shadow.png",
	},
	{
		name: "neroli",
		type: "texture",
		path: "textures/stickers/neroli.png",
	},
	{
		name: "neroli_shadow",
		type: "texture",
		path: "textures/stickers/neroli_shadow.png",
	},
	{
		name: "fern",
		type: "texture",
		path: "textures/stickers/fern.png",
	},
	{
		name: "fern_shadow",
		type: "texture",
		path: "textures/stickers/fern_shadow.png",
	},
	{
		name: "bramble",
		type: "texture",
		path: "textures/stickers/bramble.png",
	},
	{
		name: "bramble_shadow",
		type: "texture",
		path: "textures/stickers/bramble_shadow.png",
	},
	{
		name: "dead_wood_shadow",
		type: "texture",
		path: "textures/stickers/dead_wood_shadow.png",
	},
	{
		name: "dead_wood",
		type: "texture",
		path: "textures/stickers/dead_wood.png",
	},

	/**
	 * PLACE HOLDER STICKERS (TO REMOVE)
	 */

	{
		name: "mushroom2",
		type: "texture",
		path: "textures/stickers/mushroom2.png",
	},

	/***********/

	/**
	 * GRASS
	 */

	{
		name: "grass_model_lods",
		type: "gltfModel",
		path: "models/grass/grass.glb",
	},
	{
		name: "grass_texture",
		type: "texture",
		path: "textures/grass/grass.jpeg",
	},
	{
		name: "pelrin_noise",
		type: "texture",
		path: "textures/perlinnoise.webp",
	},

	/** Room **/
	{
		name: "post_card",
		type: "gltfModel",
		path: "models/room/post_card.glb",
	},
	{
		name: "room",
		type: "gltfModel",
		path: "models/room/room.glb",
	},
];

export default sources;
