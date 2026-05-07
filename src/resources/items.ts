const itemsList: MenuItemType[] = [
	/**
	 * Exists
	 * */
	{
		id: "edeilweiss",
		name: "Edeilweiss",
		model: "mushroomPaintedModel",
		vignet: "edeilweiss_flower",
		shadow: "edeilweiss_flower_shadow",
		isActor: true,
		sound: [{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 1 }]
	},
	{
		id: "buttercup",
		name: "Boutton d'or",
		model: "mushroomPaintedModel",
		vignet: "buttercup_flower",
		shadow: "buttercup_flower_shadow",
		sound: [{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 }]
	},
	{
		id: "giant_iris",
		name: "Iris Géante",
		model: "mushroomPaintedModel",
		vignet: "iris_stem_flower",
		shadow: "iris_stem_flower_shadow",
		isActor: true,
		sound: [{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 1 }]
	},
	{
		id: "giant_buttercup",
		name: "Boutton d'or Géant",
		model: "mushroomPaintedModel",
		vignet: "buttercup_stem_flower",
		shadow: "buttercup_stem_flower_shadow",
		isActor: true,
		sound: [{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 }]
	},
	{
		id: "iris",
		name: "Iris",
		model: "mushroomPaintedModel",
		vignet: "iris_flower",
		shadow: "iris_flower_shadow",
		isActor: true,
		sound: [{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 1 }]
	},
	{
		id: "lys",
		name: "Lys",
		model: "mushroomPaintedModel",
		vignet: "lys_flower",
		shadow: "lys_flower_shadow",
		isActor: true,
		sound: [{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 1 }]
	},
	{
		id: "giant_lys",
		name: "Lys géant",
		model: "mushroomPaintedModel",
		vignet: "lys_stem_flower",
		shadow: "lys_stem_flower_shadow",
		isActor: true,
		sound: [{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 1 }]
	},
	{
		id: "butterfly",
		name: "Papillon",
		model: "mushroomPaintedModel",
		vignet: "butterfly",
		shadow: "butterfly_shadow",
		sound: [{ src: "/audio/soundEffects/butterfly_01.mp3", volume: 2, loop: true }],
	},
	{
		id: "grass",
		name: "Herbe",
		model: "mushroomPaintedModel",
		vignet: "grass",
		shadow: "grass_shadow",
		sound: [{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 }],
	},
	{
		id: "ivy_leaf",
		name: "Feuille de lierre",
		model: "mushroomPaintedModel",
		vignet: "ivy_leaf",
		shadow: "ivy_leaf_shadow",
		sound: [{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 1 }]
	},
	{
		id: "mushroom",
		name: "Champignon",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom_shadow",
		sound: [{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 1 }]
	},
	{
		id: "neroli_leaves",
		name: "Feuilles de néroli",
		model: "mushroomPaintedModel",
		vignet: "neroli_leaves",
		shadow: "neroli_leaves_shadow",
		sound: [{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 }]
	},
	{
		id: "neroli",
		name: "Néroli",
		model: "mushroomPaintedModel",
		vignet: "neroli",
		shadow: "neroli_shadow",
		sound: [{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 1 }]
	},
	{
		id: "fern",
		name: "Fougère",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom",
		sound: [{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 1 }],
	},
	{
		id: "bramble",
		name: "Ronces",
		model: "brambleModel",
		vignet: "bramble",
		shadow: "bramble_shadow",
		isActor: true,
		sound: [{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 }]
	},

	/**
	 * Doesn't exist
	 */
	{
		id: "dinosaur",
		name: "Dinosaure",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom",
		sound: [{ src: "/audio/soundEffects/roarDino_01.mp3", volume: 1 }, { src: "/audio/soundEffects/roarDino_02.mp3", volume: 1 }],
	},
	{
		id: "postcard",
		name: "Carte postale",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom",
		sound: [{ src: "/audio/soundEffects/postcard_02.mp3", volume: 1 }],
	},
	{
		id: "vine",
		name: "Liane",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom",
		sound: [{ src: "/audio/soundEffects/addNatureElements_04.mp3", volume: 1 }]
	},
	{
		id: "grassClump",
		name: "Touffe d'herbe",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom",
		sound: [{ src: "/audio/soundEffects/addNatureElements_03.mp3", volume: 1 }]
	},

	{
		id: "giantClemFlower",
		name: "Clem grande fleur",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom",
		sound: [{ src: "/audio/soundEffects/addNatureElements_02.mp3", volume: 1 }]
	},

	{
		id: "toxicMushroom",
		name: "Champignon vénéneux",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom",
		sound: [{ src: "/audio/soundEffects/addNatureElements_01.mp3", volume: 1 }]
	},
	{
		id: "deadwood",
		name: "Bois mort",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom",
		sound: [{ src: "/audio/deadwood.mp3" }],
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
	sound: { src: string, volume?: number, loop?: boolean }[];
};
