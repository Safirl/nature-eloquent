export type DialogStep = {
	name?: string;
	id: number;
	objectsAdded?: {
		objectId: string;
		// resourceName?: string;
	}[];
	objectsRemoved?: string[];
	//Wait for a delay if there are no completionCondition
	completionConditions: ObjectCountCondition[] | { delay: number; nextStepId?: number };
	dialogId?: string;
	sounds?: { name: string; src: string }[];
	sceneAudio?: { type?: "ambient" | "sfx" | "onCompleted", src: string; volume: number, loop?: boolean, startDelay?: number }[];
	cleanSteps?: boolean;
	completionCallback?: string;
};

export type ObjectCountCondition = {
	objectId: string;
	count: number;
	nextStepId?: number;
};

export function instanceOfObjectCountCondition(object: any): object is ObjectCountCondition {
	return "objectId" in object;
}

export const stepDescription: DialogStep[] = [
	//intro
	{
		name: "introduction",
		id: 0,
		completionConditions: { delay: 1500, nextStepId: 1 },
		dialogId: "introduction",
		sceneAudio: [{ type: "onCompleted", src: "/audio/dooo.mp3", volume: 1, loop: false, startDelay: 0 }],
	},
	//reçoit le dinosaure : pas de dialogues
	{
		name: "dinosaure_0",
		id: 1,
		objectsAdded: [
			{
				// objectId: "dinosaur",
				objectId: "bramble",
				// resourceName: "mushroomPaintedModel",
			},
		],
		completionConditions: [{ objectId: "dinosaur", count: 1, nextStepId: 2 }],

		// dialogId: "dinosaure_0",
	},
	//a posé un premier dinosaure --> dialogue
	{
		name: "dinosaure_1",
		id: 2,
		// objectsRemoved: ["mushroom"],
		// objectsAdded: [
		// 	{
		// 		objectId: "mushroom",
		// 		// resourceName: "mushroomPaintedModel",
		// 	},
		// ],
		completionConditions: [{ objectId: "dinosaur", count: 5, nextStepId: 3 }],
		dialogId: "dinosaure_0",
	},
	//a posé plusieurs dinosaures --> Dialogue
	{
		name: "dinosaure_2",
		id: 3,
		// objectsRemoved: ["mushroom"],
		// objectsAdded: [
		// 	{
		// 		objectId: "mushroom",
		// 		// resourceName: "mushroomPaintedModel",
		// 	},
		// ],
		completionConditions: { delay: 2500, nextStepId: 4 },
		dialogId: "dinosaure_1",
	},
	//Dialogue fini --> reçoit la post card, pas de dialogue
	{
		name: "classroom_0",
		id: 4,
		objectsRemoved: ["dinosaur"],
		objectsAdded: [
			{
				objectId: "postcard",
			},
		],
		completionConditions: [{ objectId: "postcard", count: 3, nextStepId: 5 }],
		// dialogId: "classroom",
	},
	//a posé une postcard --> dialogue, pas d'interaction
	{
		name: "classroom_1",
		id: 5,
		objectsRemoved: ["postcard"],
		// objectsAdded: [
		// 	{
		// 		objectId: "postcard",
		// 	},
		// ],
		completionConditions: { delay: 1500, nextStepId: 6 },
		dialogId: "classroom",
	},
	// Reçoit l'herbarium --> Dialogue d'objet reçu
	{
		name: "herbarium_0",
		id: 6,
		// objectsRemoved: ["postcard"],
		objectsAdded: [
			{
				objectId: "vine",
			},
		],
		completionConditions: [{ objectId: "vine", count: 5, nextStepId: 7 }],
		dialogId: "herbarium_0",
	},
	// a posé 5 objets --> dialogue suivant
	{
		name: "herbarium_1",
		id: 7,
		// objectsRemoved: ["postcard"],
		objectsAdded: [
			{
				objectId: "grassClump",
			},
		],
		completionConditions: [{ objectId: "grassClump", count: 5, nextStepId: 8 }],
		dialogId: "herbarium_1",
	},
	// a posé 5 objets de plus --> ajout d'une autre option
	{
		name: "herbarium_2",
		id: 8,
		// objectsRemoved: ["grassClump", "vine"],
		objectsAdded: [
			{
				objectId: "rose",
			},
		],
		completionConditions: [{ objectId: "rose", count: 5, nextStepId: 9 }],
		dialogId: "herbarium_2",
	},
	// a posé les dernier objets --> Dialogue puis suite automatique
	{
		name: "herbarium_3",
		id: 9,
		// objectsAdded: [
		// 	{
		// 		objectId: "rose",
		// 	},
		// ],
		// pas de next step, la suivante est trigger par une triggerbox
		completionConditions: { delay: 1500, nextStepId: undefined },
		dialogId: "herbarium_3",
		completionCallback: "onIntroCompleted",
		sceneAudio: [{ type: "sfx", src: "/audio/soundEffects/openDoor_01.mp3", volume: 1, loop: false, startDelay: 2000 }]
	},
	//Déclenché par la triggerbox
	{
		name: "forestIntro",
		id: 10,
		// objectsRemoved: ["mushroom"],
		// objectsAdded: [
		// 	{
		// 		objectId: "flower",
		// 		// resourceName: "mushroomPaintedModel",
		// 	},
		// ],
		completionConditions: { delay: 2500, nextStepId: undefined },
		dialogId: "forestIntro",
		sceneAudio: [{ type: "ambient", src: "/audio/dooo.mp3", volume: 1 }]
	},

	//Autre triggerbox --> L'utilisateur reçoit les fleurs quand il rentre dans la clairière.

	{
		name: "flower",
		id: 11,
		objectsRemoved: ["grassClump", "vine", "rose"],
		objectsAdded: [
			{
				objectId: "edeilweiss",
			},
		],
		completionConditions: [{ objectId: "edeilweiss", count: 5, nextStepId: 12 }],
		// dialogId: "dinosaure_01",
	},

	//Le joueur pose plusieurs fleurs, déclenchement du dialogue plus ajout de fleurs
	{
		name: "flower1",
		id: 12,
		// objectsRemoved: ["mushroomCouc"],
		objectsAdded: [
			{
				objectId: "buttercup",
			},
		],
		completionConditions: [
			{ objectId: "edeilweiss", count: 10, nextStepId: 13 },
			{ objectId: "buttercup", count: 5, nextStepId: 13 },
		],
		dialogId: "forestLittleFlower_0",
	},

	//Clémentine réagit et ajoute ses fleurs
	{
		name: "flower2",
		id: 13,
		// objectsRemoved: ["mushroomCouc"],
		objectsAdded: [
			{
				objectId: "iris",
			},
			{
				objectId: "lys",
			},
		],
		completionConditions: [
			{ objectId: "edeilweiss", count: 15, nextStepId: 14 },
			{ objectId: "buttercup", count: 10, nextStepId: 14 },
			{ objectId: "iris", count: 5, nextStepId: 15 },
			{ objectId: "lys", count: 5, nextStepId: 15 },
		],
		dialogId: "forestLittleFlower_1",
	},

	//Le joueur place les fleurs de petit pois
	{
		name: "edeilweiss",
		id: 14,
		objectsRemoved: ["iris", "lys", "edeilweiss", "buttercup"],
		objectsAdded: [
			{
				objectId: "giant_buttercup",
			},
		],
		completionConditions: [{ objectId: "giant_buttercup", count: 5, nextStepId: undefined }],
		dialogId: "ppFlowers",
		completionCallback: "onGiantFlowersAdded",
	},

	//Le joueur place les fleurs de clem. Seulement un callback à la fin
	{
		name: "iris",
		id: 15,
		objectsRemoved: ["iris", "lys", "edeilweiss", "buttercup"],
		objectsAdded: [
			{
				objectId: "giantClemFlower",
			},
		],
		completionConditions: [{ objectId: "giantClemFlower", count: 5, nextStepId: undefined }],
		dialogId: "clemFlowers",
		completionCallback: "onGiantFlowersAdded",
	},

	//(trigger box) L'animation des fleurs a été déclenchée. Le joueur déclenche cette step en rentrant dans la chemin ouvert.
	{
		name: "clearingExit",
		id: 16,
		objectsRemoved: ["giantClemFlower", "giant_buttercup"],
		completionConditions: { delay: 1500, nextStepId: 17 },
		dialogId: "clearingExit",
	},

	//Il peut placer des papillons
	{
		name: "butterfly",
		id: 17,
		objectsAdded: [
			{
				objectId: "butterfly",
			},
		],
		completionConditions: [{ objectId: "butterfly", count: 5, nextStepId: undefined }],
		completionCallback: "onButterflyPlaced",
	},

	//triggerbox dans les chemins dans la forêt
	{
		name: "storm",
		id: 18,
		objectsRemoved: ["butterfly"],
		completionConditions: { delay: 1500, nextStepId: undefined },
		completionCallback: "onStormStarted",
		dialogId: "storm",
	},

	//triggerbox entrée seconde clairière
	{
		name: "clearing2Entrance",
		id: 19,
		objectsAdded: [
			{
				objectId: "bramble",
			},
			{
				objectId: "toxicMushroom",
			},
		],
		completionConditions: [
			{ objectId: "bramble", count: 5, nextStepId: 20 },
			{ objectId: "toxicMushroom", count: 5, nextStepId: 21 },
		],
		dialogId: "storm",
		sceneAudio: [{ type: "ambient", src: "/audio/ambiantSounds/Impro_modal_PP_non_functionnal_and_colors.mp3", volume: 0.5 }, {
			type: "sfx", src: "/audio/soundEffects/lighting.mp3", volume: 1, loop: false
		}]
	},

	//Quand les ronces ont été posées
	{
		name: "bramble",
		id: 20,
		completionConditions: [{ objectId: "bramble", count: 10, nextStepId: 22 }],
		dialogId: "bramble_0",
	},

	{
		name: "poisonousMushroom",
		id: 21,
		objectsRemoved: ["toxicMushroom"],
		completionConditions: [{ objectId: "toxicMushroom", count: 10, nextStepId: 23 }],
		dialogId: "poisonousMushroom",
	},

	{
		name: "bramble1",
		id: 22,
		objectsRemoved: ["bramble"],
		completionConditions: [{ objectId: "bramble", count: 10, nextStepId: 23 }],
		dialogId: "bramble_1",
	},

	//Dead wood
	{
		name: "deadwood",
		id: 23,
		objectsRemoved: ["bramble", "toxicMushroom"],
		objectsAdded: [
			{
				objectId: "deadwood",
			},
		],
		completionConditions: [{ objectId: "deadwood", count: 5, nextStepId: undefined }],
		completionCallback: "onDeadwoodPlaced",
	},

	//Fire
	{
		name: "fire",
		id: 24,
		completionConditions: { delay: 1500, nextStepId: undefined },
		completionCallback: "onGameEnded",
		sceneAudio: [{ type: "sfx", src: "/audio/soundEffects/fire_01.mp3", volume: 1 }],
	},
];
