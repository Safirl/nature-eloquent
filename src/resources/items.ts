const itemsList: MenuItemType[] = [

	/**
	 * Exists 
	 * */
	{ 
		id: "edeilweiss",
		name: "Edeilweiss",
		model: "mushroomPaintedModel",
		vignet: "edeilweiss_flower",
		shadow: "edeilweiss_flower_shadow"
	},
	{
		id: "buttercup",
		name: "Boutton d'or",
		model: "mushroomPaintedModel",
		vignet: "buttercup_flower",
		shadow: "buttercup_flower_shadow"
	},
	{
		id: "giant_iris",
		name: "Iris Géante",
		model: "mushroomPaintedModel",
		vignet: "iris_stem_flower",
		shadow: "iris_stem_flower_shadow"
	},
	{
		id: "giant_buttercup",
		name: "Boutton d'or Géant",
		model: "mushroomPaintedModel",
		vignet: "buttercup_stem_flower",
		shadow: "buttercup_stem_flower_shadow"
	},
	{
		id: "iris",
		name: "Iris",
		model: "mushroomPaintedModel",
		vignet: "iris_flower",
		shadow: "iris_flower_shadow"
	},
	{
		id: "lys",
		name: "Lys",
		model: "mushroomPaintedModel",
		vignet: "lys_flower",
		shadow: "lys_flower_shadow"
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
		shadow: "mushroom"
	},
	{
		id: "vine",
		name: "Liane",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom"
	},
	{
		id: "grassClump",
		name: "Touffe d'herbe",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom"
	},
	{
		id: "fern",
		name: "Fougère",
		model: "mushroomModel",
		vignet: "mushroom",
		shadow: "mushroom"
	},

	{
		id: "giantClemFlower",
		name: "Clem grande fleur",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom"
	},
	{
		id: "butterfly",
		name: "Papillon",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom"
	},
	{
		id: "bramble",
		name: "Ronces",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom"
	},
	{
		id: "toxicMushroom",
		name: "Champignon vénéneux",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom"
	},
	{
		id: "deadwood",
		name: "Bois mort",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
		shadow: "mushroom"
	},
];

export default itemsList;
export type MenuItemType = {
	id: string;
	name: string;
	model: string;
	vignet: string;
	shadow: string;
};
