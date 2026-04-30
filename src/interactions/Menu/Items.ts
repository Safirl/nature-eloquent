const itemsList: MenuItemType[] =
    [
        {
            id: "mushroom",
            name: "mushroom",
            model: "mushroomPaintedModel",
            vignet: "",
        },
        {
            id: "mushroom2",
            name: "mushroom2",
            model: "mushroomModel",
            vignet: "",
        },
        {
            id: "mushroomCouc",
            name: "mushroomCouc",
            model: "mushroomPaintedModel",
            vignet: "",
        },
    ];


export default itemsList
export type MenuItemType = {
    id: string;
    name: string;
    model: string;
    vignet: string;
}