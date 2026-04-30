export type SceneType = {
    name: string,
    steps: DialogStep[]
}[]

export type DialogStep = {
    objectsAdded: {
        objectId: string | null,
        resourceName: string | null,
        triggerCount: number,
    }[],
    objectsRemoved?: {
        objectId: string,
        triggerCount: number,
    }[],
    dialogId: string,
    callbackName: string
}

export const sceneConfig: SceneType = [
    {
        // scène 0 d'introduction
        name: "introduction",
        steps: [
            {
                objectsAdded: [{
                    objectId: null,
                    resourceName: null,
                    triggerCount: 0,
                },],
                dialogId: "introduction",
                callbackName: "onIntroductionCompleted"
            }
        ]
    },
    {
        // scène 1 : dinosaure
        name: "dinosaure",
        steps: [
            // Test avec un autre truc
            // {
            //     objectsAdded: [{
            //         objectId: "chocolat",
            //         resourceName: "mushroomModel",
            //         triggerCount: 4,
            //     }],
            //     dialogId: "dinosaure_02",
            //     callbackName: "onDinosaure03Completed"
            // },
            {
                objectsAdded: [{
                    objectId: "dinosaure",
                    resourceName: "mushroomPaintedModel",
                    triggerCount: 2,
                }],
                dialogId: "dinosaure_01",
                callbackName: "onDinosaure01Completed"
            },
            {
                objectsAdded: [{
                    objectId: "dinosaure",
                    resourceName: "mushroomPaintedModel",
                    triggerCount: 5,
                },],
                dialogId: "dinosaure_01",
                callbackName: "onDinosaure02Completed"
            },
        ]
    },

    {
        name: "toybox",
        steps: [
            {
                objectsAdded: [{
                    objectId: "carnet",
                    resourceName: "mushroomModel",
                    triggerCount: 1,
                }],
                // objectsRemoved: [{
                //     objectId: "dinosaure",
                //     triggerCount: 1,
                // }],
                dialogId: "toybox_01",
                callbackName: "onToybox01Completed"
            },
        ]
    },

    {
        name: "herbarium",
        steps: [
            {
                objectsAdded: [{
                    objectId: "herbier",
                    resourceName: "mushroomPaintedModel",
                    triggerCount: 1,
                }],
                dialogId: "herbarium_01",
                callbackName: "onHerbarium01Completed"
            },
        ]
    },

    {
        name: "gardenroom",
        steps: [
            {
                // Si on rajoute des objets qui n'ont pas besoin de dialogues
                objectsAdded: [{
                    objectId: "flower",
                    resourceName: "mushroomModel",
                    triggerCount: 0,
                }, {
                    objectId: "vines",
                    resourceName: "mushroomModel",
                    triggerCount: 0,
                },
                {
                    objectId: "grass",
                    resourceName: "mushroomModel",
                    triggerCount: 0,
                }],
                objectsRemoved: [{
                    objectId: "herbier",
                    triggerCount: 0,
                }, {
                    objectId: "carnet",
                    triggerCount: 0,
                }, {
                    objectId: "dinosaure",
                    triggerCount: 0,
                }],
                dialogId: "gardenroom_01",
                callbackName: "onGardenRoom01Completed"
            },
        ]
    }
]