export type SceneType = [{
    id: number,
    name: string,
    steps: DialogStep[]
}]

export type DialogStep = {
    id: number,
    objects: {
        objectId: string,
        triggerCount: number,
    }[],
    dialogId: string,
    callbackName: string
}

export const sceneConfig: SceneType = [
    {
        id: 0,
        name: "introduction",
        steps: [
            {
                id: 0,
                objects: [{
                    objectId: "",
                    triggerCount: 0,
                },],
                dialogId: "introduction",
                callbackName: "onIntroductionCompleted"
            }
        ]
    }
]