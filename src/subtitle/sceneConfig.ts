export type SceneType = {
    name: string,
    steps: DialogStep[]
}[]

export type DialogStep = {
    objectsAdded: {
        objectId: string,
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
                    objectId: "",
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
            {
                objectsAdded: [{
                    objectId: "dinosaure",
                    triggerCount: 2,
                },],
                dialogId: "dinosaure_01",
                callbackName: "onDinosaure01Completed"
            },
            {
                objectsAdded: [{
                    objectId: "dinosaure",
                    triggerCount: 5,
                },],
                dialogId: "dinosaure_02",
                callbackName: "onDinosaure02Completed"
            }
        ]
    },

]