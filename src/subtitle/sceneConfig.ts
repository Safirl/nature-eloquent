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

            {
                objectsAdded: [{
                    objectId: "chocolat",
                    resourceName: "mushroomModel",
                    triggerCount: 4,
                },],
                dialogId: "dinosaure_02",
                callbackName: "onDinosaure03Completed"
            },
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
]