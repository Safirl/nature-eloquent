- Début fichier scene
  
{
    [


        Introduction:[
            {
                // 1. LANCEMENT AUTOMATIQUE
                Lancement des sous-titres automatiquement sans trigger
                "dialogueId" : "introduction",
                triggerCount: 0
            }
        ]


        OpenToyBox:[
            {
               // 1. AJOUT DINOSAURE BARRE OUTIL
               L'utilisateur clique sur la box et un dinausore apparaît dans la barre d'outil (interactableObjects)

               objects: [
                {name:t-rex,resourceName: tRex},
                {name:Big-trex,resourceName: tRex},
               ]


              // 2. PLACE 1 DINOSAURE
              "objectName" : "dinosaure",
              "dialogueId" : "dinosaure_01",
              "triggerCount" : 1,
              {enable, disable}


              // 3. PLACE 5 DINOSAURES
              "objectName" : "dinosaure",
              "dialogueId":"dinosaure_02",
              "triggerCount": 5,


              // 4. RETIRER DINOSAURE BARRE OUTIL
             objects:[

             ]

            // CONDITION POUR PASSER A LA SUITE : objectName === "dinosaure" & triggerCount === 5

            }

        OpenHerbariumBox:[

        ]
            // 1. AJOUT CARNET BARRE OUTIL
            L'utilisateur clique sur la box et un carnet apparaît dans la barre d'outil (interactableObjects)
            objects : [
                {name:herbarium,resourceName: herbarium},
            ]

            // 2. PLACE 1 CARNET 
            "objectName" : "herbarium",
            "dialogueId" : "herbarium_01"

            // 3. RETIRER CARNET BARRE OUTIL
            objects : [

            ]

            // 4. EN MÊME TEMPS QUE LE PLACEMENT DU CARNET
            objects : [
                {name:fleur,resourceName: fleur},
                {name:herbe,resourceName: herbe},
                {name:liane,resourceName: liane},
            ]


            // 5. 

        ]




    ]
}





OLD CODE :

<!-- Interaction BTN  -->

    // private waitingForInteraction: boolean = false;
    // declare nextDialogButton: HTMLElement


    init(
        <!-- Bouton pour passer à la scène suivante -->

        // this.nextDialogButton = document.getElementById("next-dialog") as HTMLElement;
        // this.nextDialogButton.addEventListener("click", () => {
        //     if (this.waitingForInteraction) {
        //         this.waitingForInteraction = false;
        //         this.nextStepOrSceneAfterStepDialogFinished("onIntroductionCompleted");
        //     }
        // })


          // Si on souhaite que l'utilisateur interagisse pour passer à la step suivante.

            // if (callbackName === "onIntroductionCompleted") {
            //     this.waitingForInteraction = true;
            //     return;
            // }

            // if (callbackName === "onDinosaure02Completed") {
            //     this.waitingForInteraction = true;
            //     return;
            // }

            // if (callbackName === "onClassroom01Completed") {
            //     this.waitingForInteraction = true;
            //     return;
            // }

    )







    // playStep(stepId: number) {
    //     const scene = this.sceneConfig[this.currentSceneId]
    //     // console.log("playStep", stepId, scene)
    //     const step = scene.steps[stepId]
    //     if (!step) {
    //         throw new Error("step not found")
    //     }
    //     this.stepDescriptions.push({ count: 0, relatedStep: step })
    // }




   // // On vérifie si l'obj correspond à la sceneConfig
    // onObjectPlaced = (callbacks: string) => {
    //     // Le count est incrémenté en fonction du nombre de jouet
    //     console.log("description", this.stepDescriptions)

    //     this.stepDescriptions.forEach(stepDescription => {
    //         const object = stepDescription.relatedStep.objectsAdded.find(obj => obj.objectId === callbacks)
    //         console.log("object found", object)
    //         if (!object) return;
    //         stepDescription.count++
    //         console.log("stepDescription count", stepDescription.count)
    //         console.log("stepDescription relatedStep", stepDescription.relatedStep)
    //         if (stepDescription.count === object.triggerCount) {
    //             this.triggerDialog(stepDescription.relatedStep.dialogId, stepDescription.relatedStep)
    //         }

    //     })
    // }