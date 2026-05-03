export type SceneType = {
    name: string,
    steps: DialogStep[]
}[]

export type DialogStep = {
    objectsAdded?: {
        objectId: string | null,
        resourceName: string | null,
        triggerCount: number | null,
    }[],
    objectsRemoved?: {
        objectId: string,
        triggerCount: number | null,
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
                dialogId: "introduction",
                callbackName: "onIntroductionCompleted"
            }
        ]
    },
    {
        // scène 1 : dinosaure
        name: "dinosaure",
        steps: [
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
                    triggerCount: 5,
                }, {
                    objectId: "vines",
                    resourceName: "mushroomModel",
                    triggerCount: 5,
                },
                {
                    objectId: "grass",
                    resourceName: "mushroomModel",
                    triggerCount: 5,
                }],
                objectsRemoved: [{
                    objectId: "herbier",
                    triggerCount: null,
                }, {
                    objectId: "carnet",
                    triggerCount: null,
                }, {
                    objectId: "dinosaure",
                    triggerCount: null,
                }],
                dialogId: "gardenroom_01",
                callbackName: "onGardenRoom01Completed"
            },
        ]
    }
]