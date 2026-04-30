export type SceneType = {
    name: string,
    steps: DialogStep[]
}[]

export type DialogStep = {
    objectsAdded: {
        objectId: string,
        resourceName: string,
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
                    resourceName: "",
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
                    resourceName: "mushroomPaintedModel",
                    triggerCount: 2,
                },],
                dialogId: "dinosaure_01",
                callbackName: "onDinosaure01Completed"
            },
            {
                objectsAdded: [{
                    objectId: "dinosaure",
                    resourceName: "mushroomPaintedModel",
                    triggerCount: 5,
                },],
                dialogId: "dinosaure_02",
                callbackName: "onDinosaure02Completed"
            },
            // Test avec un autre truc
            {
                objectsAdded: [{
                    objectId: "chocolat",
                    resourceName: "mushroomModel",
                    triggerCount: 4,
                },],
                dialogId: "dinosaure_03",
                callbackName: "onDinosaure03Completed"
            }
        ]
    },

]


// NOTE
// Pour la scène d'intro = pas d'objet de sélection
// Pour la scène de la box dino = juste un dinosaure à sélectionner
// Pour la scène de la box primaire = juste ??????? carnet et...

// Pour la scène de l'herbier = un objet de carnet à sélectionner
// Après l'avoir sélectionné alors on affiche le dialogue de l'herbier
// Puis on affiche en même temps (fleur, liane, herbe)
