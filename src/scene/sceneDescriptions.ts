import * as THREE from "three";

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
	sceneAudio?: {
		type?: "ambient" | "sfx" | "onCompleted" | "sfxSpatial";
		src: string;
		volume: number;
		loop?: boolean;
		startDelay?: number;
		position?: THREE.Vector3;
	}[];
	removeAudio?: string[];
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
		sceneAudio: [
			{
				type: "onCompleted",
				src: "/audio/soundEffects/openBox_01.mp3",
				volume: 1,
				loop: false,
				startDelay: 0,
			},
		],
	},
	//reçoit le dinosaure : pas de dialogues
	{
		name: "dinosaure_0",
		id: 1,
		objectsAdded: [
			{
				objectId: "dinosaur",
				// objectId: "bramble",
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
		sceneAudio: [
			{
				type: "onCompleted",
				src: "/audio/soundEffects/openBox_01.mp3",
				volume: 1,
				loop: false,
				startDelay: 0,
			},
		],
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
		sceneAudio: [
			{
				type: "onCompleted",
				src: "/audio/soundEffects/openBox_01.mp3",
				volume: 1,
				loop: false,
				startDelay: 0,
			},
		],
	},
	// Reçoit l'herbarium --> Dialogue d'objet reçu
	{
		name: "herbarium_0",
		id: 6,
		// objectsRemoved: ["postcard"],
		objectsAdded: [
			{
				objectId: "ivy_leaf",
			},
		],
		completionConditions: [{ objectId: "ivy_leaf", count: 5, nextStepId: 7 }],
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
				objectId: "fern",
			},
		],
		completionConditions: [{ objectId: "fern", count: 5, nextStepId: 9 }],
		dialogId: "herbarium_2",
	},
	// a posé les dernier objets --> Dialogue puis suite automatique
	{
		name: "herbarium_3",
		id: 9,
		// objectsAdded: [
		// 	{
		// 		objectId: "neroli",
		// 	},
		// ],
		// pas de next step, la suivante est trigger par une triggerbox
		completionConditions: { delay: 1500, nextStepId: undefined },
		dialogId: "herbarium_3",
		completionCallback: "onIntroCompleted",
		sceneAudio: [
			{
				type: "sfxSpatial",
				src: "/audio/soundEffects/openDoor_01.mp3",
				volume: 1,
				loop: false,
				startDelay: 2000,
				position: new THREE.Vector3(1, 1, 1),
			},
		],
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
		sceneAudio: [
			{
				type: "ambient",
				src: "/audio/ambientSounds/EV_Impro_modal_PP_intro.mp3",
				volume: 0.08,
				loop: true,
			},
			{
				type: "sfx",
				src: "/audio/ambientSounds/forestAmbient.mp3",
				volume: 0.07,
				loop: false,
				startDelay: 0,
			},
		],
	},

	//Autre triggerbox --> L'utilisateur reçoit les fleurs quand il rentre dans la clairière.
	{
		name: "flower",
		id: 11,
		objectsRemoved: ["grassClump", "ivy_leaf", "fern"],
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
		sceneAudio: [
			{
				type: "ambient",
				src: "",
				volume: 0.1,
			},
		],
		objectsRemoved: ["giantClemFlower", "giant_buttercup"],
		completionConditions: { delay: 1500, nextStepId: undefined },
		dialogId: "clearingExit",
	},

	//Il peut placer des papillons
	// {
	// 	name: "butterfly",
	// 	id: 17,
	// 	objectsAdded: [
	// 		{
	// 			objectId: "butterfly",
	// 		},
	// 	],
	// 	completionConditions: [{ objectId: "butterfly", count: 5, nextStepId: undefined }],
	// 	completionCallback: "onButterflyPlaced",
	// },
	// Je rajoute une "scène" en plus pour jouer l'éclair juste avant le blabla du "tu avais du l'orage?"
	// code qui peut mieux être fait
	{
		name: "lighting",
		id: 99,
		completionConditions: { delay: 4000, nextStepId: 18 },
		completionCallback: "onLighting",
		sceneAudio: [
			{
				type: "sfx",
				src: "/audio/soundEffects/oneLighting.mp3",
				volume: 1,
				loop: false,
				startDelay: 1500,
			},
		],
		dialogId: "void",
	},

	//triggerbox dans les chemins dans la forêt
	{
		name: "storm",
		id: 18,
		objectsRemoved: ["butterfly"],
		completionConditions: { delay: 1500, nextStepId: undefined },
		completionCallback: "onStormStarted",
		dialogId: "storm",
		sceneAudio: [
			{
				type: "ambient",
				src: "",
				volume: 0.1,
			},
			{
				type: "sfx",
				src: "/audio/soundEffects/orageWind.mp3",
				volume: 0.7,
				loop: true,
				startDelay: 800,
			},
			{
				type: "sfx",
				src: "/audio/soundEffects/lightingOrage.mp3",
				volume: 1,
				loop: false,
				startDelay: 800,
			},
		],
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
		// dialogId: "storm",
		sceneAudio: [
			{
				type: "sfx",
				src: "/audio/soundEffects/slowBreathStress.mp3",
				volume: 0.5,
				loop: true,
			},
		],
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
		completionConditions: [{ objectId: "toxicMushroom", count: 10, nextStepId: 24 }],
		dialogId: "poisonousMushroom",
	},

	{
		name: "bramble1",
		id: 22,
		completionConditions: [{ objectId: "bramble", count: 15, nextStepId: 24 }],
		dialogId: "bramble_1",
		sceneAudio: [
			{
				type: "sfx",
				src: "/audio/soundEffects/fastBreathStress.mp3",
				volume: 0.6,
				loop: true,
			},
		],
		removeAudio: ["/audio/soundEffects/slowBreathStress.mp3"],
	},

	// //Dead wood
	// {
	// 	name: "deadwood",
	// 	id: 23,
	// 	objectsRemoved: ["bramble", "toxicMushroom"],
	// 	objectsAdded: [
	// 		{
	// 			objectId: "deadwood",
	// 		},
	// 	],
	// 	completionConditions: [{ objectId: "deadwood", count: 5, nextStepId: 24 }],
	// 	completionCallback: "onDeadwoodPlaced",
	// },

	//Fire
	{
		name: "lightening2",
		id: 24,
		objectsRemoved: ["bramble", "toxicMushroom"],
		completionConditions: { delay: 2500, nextStepId: 25 },
		completionCallback: "onGameEnded",
		// dialogId: "fire",
		sceneAudio: [
			{
				type: "sfx",
				src: "/audio/soundEffects/fire_01.mp3",
				volume: 1,
				loop: true,
				startDelay: 0,
			},
			{
				type: "sfx",
				src: "/audio/soundEffects/oneLighting.mp3",
				volume: 0.8,
				loop: false,
				startDelay: 0,
			},
		],
	},
	{
		name: "fire",
		id: 25,
		completionConditions: { delay: 1500, nextStepId: undefined },
		completionCallback: "onGameEnded",
		dialogId: "fire",
		// sceneAudio: [
		// 	{
		// 		type: "sfx",
		// 		src: "/audio/soundEffects/fire_01.mp3",
		// 		volume: 1,
		// 		loop: true,
		// 		startDelay: 0,
		// 	},
		// 	{
		// 		type: "sfx",
		// 		src: "/audio/soundEffects/oneLighting.mp3",
		// 		volume: 1,
		// 		loop: false,
		// 		startDelay: 0,
		// 	},
		// ],
	},
];
