const itemsList: MenuItemType[] = [
	/**
	 * Exists
	 * */
	{
		id: "edeilweiss",
		name: "Edeilweiss",
		model: "edelweissModel",
		vignet: "edeilweiss_flower",
		shadow: "edeilweiss_flower_shadow",
		isActor: true,
		sound: [
			{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 0.5 },
		],
		animationSound: { src: "/audio/soundEffects/growthAnimation_01.mp3", volume: 0.5 },
	},
	{
		id: "buttercup",
		name: "Boutton d'or",
		model: "buttercupModel",
		vignet: "buttercup_flower",
		shadow: "buttercup_flower_shadow",
		isActor: true,
		sound: [
			{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 0.5 },
		],
		animationSound: { src: "/audio/soundEffects/growthAnimation_01.mp3", volume: 1 },
	},
	{
		id: "giant_iris",
		name: "Iris Géante",
		model: "giantIrisModel",
		vignet: "iris_stem_flower",
		shadow: "iris_stem_flower_shadow",
		isActor: true,
		sound: [{ src: "/audio/soundEffects/magicSound_01.mp3", volume: 1 }],
		animationSound: { src: "/audio/soundEffects/growthAnimation_02.mp3", volume: 1 },
	},
	{
		id: "giant_buttercup",
		name: "Boutton d'or Géant",
		model: "giantButtercupModel",
		vignet: "buttercup_stem_flower",
		shadow: "buttercup_stem_flower_shadow",
		isActor: true,
		sound: [{ src: "/audio/soundEffects/magicSound_01.mp3", volume: 1 }],
		animationSound: { src: "/audio/soundEffects/growthAnimation_02.mp3", volume: 1 },
	},
	{
		id: "iris",
		name: "Iris",
		model: "irisModel",
		vignet: "iris_flower",
		shadow: "iris_flower_shadow",
		isActor: true,
		sound: [
			{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 0.5 },
		],
		animationSound: { src: "/audio/soundEffects/growthAnimation_01.mp3", volume: 1 },
	},
	{
		id: "lys",
		name: "Lys",
		model: "lysModel",
		vignet: "lys_flower",
		shadow: "lys_flower_shadow",
		isActor: true,
		sound: [
			{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 0.5 },
		],
		animationSound: { src: "/audio/soundEffects/growthAnimation_01.mp3", volume: 1 },
	},
	{
		id: "giant_lys",
		name: "Lys géant",
		model: "giantLysModel",
		vignet: "lys_stem_flower",
		shadow: "lys_stem_flower_shadow",
		isActor: true,
		sound: [{ src: "/audio/soundEffects/magicSound_01.mp3", volume: 1 }],
	},
	{
		id: "butterfly",
		name: "Papillon",
		model: "mushroomPaintedModel",
		vignet: "butterfly",
		isActor: true,
		shadow: "butterfly_shadow",
		sound: [{ src: "/audio/soundEffects/butterfly_01.mp3", volume: 1.5, loop: false }],
	},
	{
		id: "grassClump",
		name: "Herbe",
		model: "grassClumpModel",
		vignet: "grass",
		isActor: true,
		shadow: "grass_shadow",
		sound: [
			{ src: "/audio/soundEffects/grassClump_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/grassClump_02.mp3", volume: 1 },
			{ src: "/audio/soundEffects/grassClump_03.mp3", volume: 1 },
		],
	},
	{
		id: "ivy_leaf",
		name: "Feuille de lierre",
		model: "vineModel",
		vignet: "ivy_leaf",
		isActor: true,
		shadow: "ivy_leaf_shadow",
		sound: [
			{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 4 },
			{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 4 },
		],
	},
	{
		id: "mushroom",
		name: "Champignon",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		isActor: true,
		shadow: "mushroom_shadow",
		sound: [
			{ src: "/audio/soundEffects/mushroom_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/mushroom_02.mp3", volume: 1 },
			{ src: "/audio/soundEffects/mushroom_03.mp3", volume: 1 },
			{ src: "/audio/soundEffects/mushroom_04.mp3", volume: 1 },
		],
	},
	{
		id: "neroli_leaves",
		name: "Feuilles de néroli",
		model: "mushroomPaintedModel",
		vignet: "neroli_leaves",
		isActor: true,
		shadow: "neroli_leaves_shadow",
		sound: [
			{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 4 },
			{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 4 },
		],
	},
	{
		id: "neroli",
		name: "Néroli",
		model: "mushroomPaintedModel",
		isActor: true,
		vignet: "neroli",
		shadow: "neroli_shadow",
		sound: [
			{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 4 },
			{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 4 },
		],
	},
	{
		id: "fern",
		name: "Fougère",
		model: "fernModel",
		vignet: "fern",
		isActor: true,
		shadow: "fern_shadow",
		sound: [
			{ src: "/audio/soundEffects/fern_01.mp3", volume: 0.5 },
			{ src: "/audio/soundEffects/fern_02.mp3", volume: 0.5 },
		],
	},
	{
		id: "bramble",
		name: "Ronces",
		model: "brambleModel",
		vignet: "bramble",
		shadow: "bramble_shadow",
		isActor: true,
		sound: [
			{ src: "/audio/soundEffects/grassClump_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/grassClump_02.mp3", volume: 1 },
			{ src: "/audio/soundEffects/grassClump_03.mp3", volume: 1 },
		],
	},
	{
		id: "postcard",
		name: "Carte postale",
		model: "post_card",
		isActor: true,
		vignet: "postcard",
		shadow: "mushroom",
		sound: [
			{ src: "/audio/soundEffects/postcard_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/postcard_02.mp3", volume: 1 },
		],
	},
	/**
	 * Doesn't exist
	 */
	{
		id: "dinosaur",
		name: "Dinosaure",
		model: "tRexModel",
		vignet: "dino",
		shadow: "mushroom",
		isActor: true,
		sound: [
			{ src: "/audio/soundEffects/roarDino_01.mp3", volume: 0.08 },
			{ src: "/audio/soundEffects/roarDino_02.mp3", volume: 0.08 },
		],
		animationDuration: 1,
	},
	{
		id: "postcard",
		name: "Carte postale",
		model: "postcardModel",
		vignet: "postcard",
		isActor: true,
		shadow: "mushroom",
		sound: [
			{ src: "/audio/soundEffects/postcard_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/postcard_02.mp3", volume: 1 },
		],
	},
	// {
	// 	id: "vine",
	// 	name: "Liane",
	// 	model: "vineModel",
	// 	vignet: "vine",
	// 	shadow: "mushroom",
	// 	sound: [
	// 		{ src: "/audio/soundEffects/vine_01.mp3", volume: 2 },
	// 		{ src: "/audio/soundEffects/vine_02.mp3", volume: 2 },
	// 		{ src: "/audio/soundEffects/vine_03.mp3", volume: 2 },
	// 	],
	// },

	{
		id: "darkFlower",
		name: "Fleur terrifiante",
		model: "darkFlowerModel",
		vignet: "mushroom",
		isActor: true,
		shadow: "mushroom",
		sound: [
			{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 4 },
			{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 4 },
		],
	},

	{
		id: "giantClemFlower",
		name: "Clem grande fleur",
		model: "giantLysModel",
		vignet: "mushroom",
		isActor: true,
		shadow: "mushroom",
		sound: [
			{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 4 },
			{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 4 },
		],
	},

	{
		id: "toxicMushroom",
		name: "Champignon vénéneux",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		isActor: true,
		shadow: "mushroom",
		sound: [
			{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 4 },
			{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 1 },
			{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 4 },
		],
	},
	{
		id: "deadwood",
		name: "Bois mort",
		model: "mushroomPaintedModel",
		vignet: "dead_wood",
		isActor: true,
		shadow: "dead_wood_shadow",
		sound: [
			{ src: "/audio/soundEffects/deadwood_01.mp3", volume: 0.8 },
			{ src: "/audio/soundEffects/deadwood_02.mp3", volume: 0.8 },
			{ src: "/audio/soundEffects/deadwood_03.mp3", volume: 0.6 },
		],
	},
];

export default itemsList;
export type MenuItemType = {
	id: string;
	name: string;
	model: string;
	vignet: string;
	shadow: string;
	isActor?: boolean;
	sound: { src: string; volume?: number; loop?: boolean }[];
	animationSound?: { src: string; volume?: number; loop?: boolean };
	animationDuration?: number;
};
