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
	},
	{
		id: "buttercup",
		name: "Boutton d'or",
		model: "mushroomPaintedModel",
		vignet: "buttercup_flower",
		shadow: "buttercup_flower_shadow",
	},
	{
		id: "giant_iris",
		name: "Iris Géante",
		model: "mushroomPaintedModel",
		vignet: "iris_stem_flower",
		shadow: "iris_stem_flower_shadow",
		isActor: true,
	},
	{
		id: "giant_buttercup",
		name: "Boutton d'or Géant",
		model: "mushroomPaintedModel",
		vignet: "buttercup_stem_flower",
		shadow: "buttercup_stem_flower_shadow",
		isActor: true,
	},
	{
		id: "iris",
		name: "Iris",
		model: "mushroomPaintedModel",
		vignet: "iris_flower",
		shadow: "iris_flower_shadow",
		isActor: true,
	},
	{
		id: "lys",
		name: "Lys",
		model: "mushroomPaintedModel",
		vignet: "lys_flower",
		shadow: "lys_flower_shadow",
		isActor: true,
	},
	{
		id: "giant_lys",
		name: "Lys géant",
		model: "mushroomPaintedModel",
		vignet: "lys_stem_flower",
		shadow: "lys_stem_flower_shadow",
		isActor: true,
	},
	{
		id: "butterfly",
		name: "Papillon",
		model: "mushroomPaintedModel",
		vignet: "butterfly",
		shadow: "butterfly_shadow",
	},
	{
		id: "grass",
		name: "Herbe",
		model: "mushroomPaintedModel",
		vignet: "grass",
		shadow: "grass_shadow",
	},
	{
		id: "ivy_leaf",
		name: "Feuille de lierre",
		model: "mushroomPaintedModel",
		vignet: "ivy_leaf",
		shadow: "ivy_leaf_shadow",
	},
	{
		id: "mushroom",
		name: "Champignon",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom_shadow",
	},
	{
		id: "neroli_leaves",
		name: "Feuilles de néroli",
		model: "mushroomPaintedModel",
		vignet: "neroli_leaves",
		shadow: "neroli_leaves_shadow",
	},
	{
		id: "neroli",
		name: "Néroli",
		model: "mushroomPaintedModel",
		vignet: "neroli",
		shadow: "neroli_shadow",
	},
	{
		id: "fern",
		name: "Fougère",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom",
	},
	{
		id: "bramble",
		name: "Ronces",
		model: "brambleModel",
		vignet: "bramble",
		shadow: "bramble_shadow",
		isActor: true,
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
	},
	{
		id: "postcard",
		name: "Carte postale",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom",
	},
	{
		id: "vine",
		name: "Liane",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom",
	},
	{
		id: "grassClump",
		name: "Touffe d'herbe",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom",
	},

	{
		id: "giantClemFlower",
		name: "Clem grande fleur",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom",
	},

	{
		id: "toxicMushroom",
		name: "Champignon vénéneux",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom",
	},
	{
		id: "deadwood",
		name: "Bois mort",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom",
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
};
