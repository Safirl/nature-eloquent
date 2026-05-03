export type SceneType = {
    name: string,
    steps: DialogStep[]
}[]

export type DialogStep = {
    objectsAdded?: {
        objectId: string | null,
        resourceName: string | null,
        triggerCount: number | null,
        isActive: boolean,
    }[],
    objectsRemoved?: string[],
    replaceObjects?: {
        objectId: string,
        resourceName: string,
    }[],
    completionCondition?: {
        objectId: string[],
        count: number
    }
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
        name: "dinosaureBox",
        steps: [
            {
                objectsAdded: [{
                    objectId: "dinosaure",
                    resourceName: "mushroomPaintedModel",
                    triggerCount: 1,
                    isActive: true
                }],
                dialogId: "dinosaure_01",
                callbackName: "onDinosaure01Completed"
            },
            {
                objectsAdded: [{
                    objectId: "dinosaure",
                    resourceName: "mushroomPaintedModel",
                    triggerCount: 5,
                    isActive: true
                },],
                dialogId: "dinosaure_01",
                callbackName: "onDinosaure02Completed"
            },
        ]
    },
    {
        // scène 2 : carnet
        name: "classroomBox",
        steps: [
            {
                objectsAdded: [{
                    objectId: "carnet",
                    resourceName: "mushroomModel",
                    triggerCount: 1,
                    isActive: true
                }],
                dialogId: "classroom_01",
                callbackName: "onClassroom01Completed"
            },
        ]
    },

    {
        // Scène 3 : herbier
        name: "herbariumBox",
        steps: [
            {
                objectsAdded: [{
                    objectId: "herbier",
                    resourceName: "mushroomPaintedModel",
                    triggerCount: 1,
                    isActive: true
                }],
                dialogId: "herbarium_01",
                callbackName: "onHerbarium01Completed"
            },
        ]
    },

    {
        name: "gardenBedroom",
        steps: [
            {
                objectsAdded: [{
                    objectId: "flower",
                    resourceName: "mushroomModel",
                    triggerCount: null,
                    isActive: true,
                }, {
                    objectId: "vines",
                    resourceName: "mushroomModel",
                    triggerCount: null,
                    isActive: true,
                },
                {
                    objectId: "grass",
                    resourceName: "mushroomModel",
                    triggerCount: null,
                    isActive: true,
                }],
                objectsRemoved: ["herbier", "carnet", "dinosaure"],
                completionCondition: {
                    objectId: ["flower", "vines", "grass"],
                    count: 10
                },
                dialogId: "gardenbedroom_01",
                callbackName: "onGardenBedroom01Completed"
            },
        ]
    },

    {
        name: "enterClairvoyantForest",
        steps: [
            {
                dialogId: "enterClairvoyantForest_01",
                callbackName: "onEnterClairvoyantForestCompleted"
            }
        ]
    },

    {
        name: "clairvoyantForest",
        steps: [

            // TRANSFORMATION BUTTERFLY -> FAIRY
            {
                objectsAdded: [{
                    objectId: "butterfly",
                    resourceName: "mushroomModel",
                    triggerCount: 1,
                    isActive: true,
                }],
                dialogId: "forestButterfly_01",
                callbackName: "onForestButterfly01Completed"
            },
            {
                objectsAdded: [{
                    objectId: "butterfly",
                    resourceName: "mushroomModel",
                    triggerCount: 5,
                    isActive: true,
                }],
                replaceObjects: [{
                    objectId: "fairy",
                    resourceName: "mushroomModel",
                }],
                dialogId: "forestButterfly_02",
                callbackName: "onForestButterfly02Completed"
            },
            {
                objectsAdded: [{
                    objectId: "fairy",
                    resourceName: "mushroomModel",
                    triggerCount: 1,
                    isActive: false,
                }],
                dialogId: "forestFairy_01",
                callbackName: "onForestFairy01Completed"
            },
            {
                objectsAdded: [{
                    objectId: "fairy",
                    resourceName: "mushroomModel",
                    triggerCount: 5,
                    isActive: false,
                }],
                dialogId: "forestFairy_02",
                callbackName: "onForestFairy02Completed"
            },

            // TRANSFORMATION FLOWER -> BIG BIG FLOWERS
            {
                objectsAdded: [{
                    objectId: "flower",
                    resourceName: "mushroomModel",
                    triggerCount: 1,
                    isActive: true,
                }],
                dialogId: "forestLittleFlower_01",
                callbackName: "onForestLittleFlower01Completed"
            },
            {
                objectsAdded: [{
                    objectId: "flower",
                    resourceName: "mushroomModel",
                    triggerCount: 5,
                    isActive: true,
                }],
                replaceObjects: [{
                    objectId: "exoticFlower01",
                    resourceName: "mushroomModel",
                },
                {
                    objectId: "exoticFlower02",
                    resourceName: "mushroomModel",
                }
                    ,
                {
                    objectId: "exoticFlower03",
                    resourceName: "mushroomModel",
                }
                ],
                dialogId: "forestLittleFlower_02",
                callbackName: "onForestLittleFlower02Completed"
            }
        ]
    },
    {
        name: "storm",
        steps: [
            {
                objectsRemoved: ["fairy", "flower", "vines", "grass", "exoticFlower01", "exoticFlower02", "exoticFlower03  "],
                dialogId: "forestStorm_01",
                callbackName: "onStorm01Completed"
            }
        ],
    },
    {
        name: "duringStorm",
        steps: [
            {
                objectsAdded: [{
                    objectId: "bramble",
                    resourceName: "mushroomModel",
                    triggerCount: 1,
                    isActive: true,
                },
                {
                    objectId: "toxicMushroom",
                    resourceName: "mushroomModel",
                    triggerCount: 1,
                    isActive: true
                },
                {
                    objectId: "ant",
                    resourceName: "mushroomModel",
                    triggerCount: 1,
                    isActive: true
                }
                ],
                dialogId: "forestStorm_01",
                callbackName: "onDuringStorm01Completed"
            }
        ]
    }
]