import mushroomIcon from "../books/mushroom.png";
import mushroom2Icon from "../books/mushroom2.png";

const itemsList: MenuItemType[] = [
	{
		id: "mushroom",
		name: "mushroom",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
	},
	{
		id: "mushroom2",
		name: "mushroom2",
		model: "mushroomModel",
		vignet: "mushroom2",
	},
	{
		id: "mushroomCouc",
		name: "mushroomCouc",
		model: "mushroomPaintedModel",
		vignet: "mushroom",
	},
];

export default itemsList;
export type MenuItemType = {
	id: string;
	name: string;
	model: string;
	vignet: string;
};
