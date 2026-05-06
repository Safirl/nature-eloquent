import mushroomIcon from "../books/mushroom.png";
import mushroom2Icon from "../books/mushroom2.png";

const itemsList: MenuItemType[] = [
	{
		id: "dinosaur",
		name: "Dinosaure",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
	},
	{
		id: "postcard",
		name: "Carte postale",
		model: "mushroomModel",
		vignet: "mushroom2",
	},
	{
		id: "vine",
		name: "Liane",
		model: "mushroomModel",
		vignet: mushroom2Icon,
	},
	{
		id: "grassClump",
		name: "Touffe d'herbe",
		model: "mushroomModel",
		vignet: mushroom2Icon,
	},
	{
		id: "fern",
		name: "Fougère",
		model: "mushroomModel",
		vignet: mushroom2Icon,
	},
	{
		id: "ppFlower",
		name: "mushroomCouc",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
	},
	{
		id: "ppFlower1",
		name: "mushroomCouc",
		model: "mushroomPaintedModel",
		vignet: mushroomIcon,
	},
	{
		id: "giantPPFlower",
		name: "pp grande fleur",
		model: "mushroomPaintedModel",
		vignet: mushroomIcon,
	},
	{
		id: "clemFlower",
		name: "clem fleur",
		model: "mushroomPaintedModel",
		vignet: mushroomIcon,
	},
	{
		id: "clemFlower1",
		name: "clem fleur",
		model: "mushroomPaintedModel",
		vignet: mushroomIcon,
	},
	{
		id: "giantClemFlower",
		name: "Clem grande fleur",
		model: "mushroomPaintedModel",
		vignet: mushroomIcon,
	},
	{
		id: "butterfly",
		name: "Papillon",
		model: "mushroomPaintedModel",
		vignet: mushroomIcon,
	},
	{
		id: "bramble",
		name: "Ronces",
		model: "mushroomPaintedModel",
		vignet: mushroomIcon,
	},
	{
		id: "toxicMushroom",
		name: "Champignon vénéneux",
		model: "mushroomPaintedModel",
		vignet: mushroomIcon,
	},
	{
		id: "deadwood",
		name: "Bois mort",
		model: "mushroomPaintedModel",
		vignet: mushroomIcon,
	},
];

export default itemsList;
export type MenuItemType = {
	id: string;
	name: string;
	model: string;
	vignet: string;
};
