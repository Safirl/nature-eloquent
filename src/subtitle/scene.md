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