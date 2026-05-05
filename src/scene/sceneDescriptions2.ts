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
	dialogId: string;
	cleanSteps?: boolean;
};

export type ObjectCountCondition = {
	objectId: string;
	count: number;
	nextStepId?: number;
	callbackName?: string;
};

export function instanceOfObjectCountCondition(object: any): object is ObjectCountCondition {
	return "objectId" in object;
}

export const stepDescription: DialogStep[] = [
	{
		name: "introduction",
		id: 0,
		completionConditions: { delay: 2500, nextStepId: 1 },
		dialogId: "introduction",
	},
	{
		name: "dinosaureBox",
		id: 1,
		objectsAdded: [
			{
				objectId: "mushroom",
				// resourceName: "mushroomPaintedModel",
			},
		],
		completionConditions: [{ objectId: "mushroom", count: 5, nextStepId: 2 }],
		dialogId: "dinosaure_01",
	},
	{
		name: "dinosaureBox1",
		id: 2,
		objectsRemoved: ["mushroom"],
		objectsAdded: [
			{
				objectId: "mushroom",
				// resourceName: "mushroomPaintedModel",
			},
		],
		completionConditions: [{ objectId: "mushroom", count: 6, nextStepId: 3 }],
		dialogId: "dinosaure_01",
	},
	{
		name: "classroomBox",
		id: 3,
		objectsRemoved: ["mushroom"],
		objectsAdded: [
			{
				objectId: "mushroom2",
				// resourceName: "mushroomPaintedModel",
			},
			{
				objectId: "mushroomCouc",
				// resourceName: "mushroomModel",
			},
			{
				objectId: "mushroom",
				// resourceName: "mushroomModel",
			},
		],
		completionConditions: [
			{ objectId: "mushroom2", count: 5, nextStepId: 4 },
			{ objectId: "mushroom", count: 5, nextStepId: 5 },
		],
		dialogId: "dinosaure_01",
	},
	{
		name: "classroomBox",
		id: 4,
		objectsRemoved: ["mushroom2"],
		objectsAdded: [
			{
				objectId: "mushroomCouc",
				// resourceName: "mushroomPaintedModel",
			},
		],
		completionConditions: [{ objectId: "mushroomCouc", count: 5, nextStepId: 6 }],
		dialogId: "dinosaure_01",
	},
	{
		name: "classroomBox",
		id: 5,
		objectsRemoved: ["mushroom"],
		objectsAdded: [
			{
				objectId: "mushroom2",
				// resourceName: "mushroomPaintedModel",
			},
			{
				objectId: "mushroom",
				// resourceName: "mushroomModel",
			},
		],
		completionConditions: [
			{ objectId: "mushroom2", count: 5, nextStepId: 3 },
			{ objectId: "mushroom", count: 5, nextStepId: 4 },
		],
		dialogId: "dinosaure_01",
	},
	{
		name: "classroomBox",
		id: 6,
		objectsRemoved: ["mushroomCouc"],
		objectsAdded: [
			{
				objectId: "mushroom2",
				// resourceName: "mushroomPaintedModel",
			},
			{
				objectId: "mushroom",
				// resourceName: "mushroomModel",
			},
		],
		completionConditions: [
			{ objectId: "mushroom2", count: 5, nextStepId: 3 },
			{ objectId: "mushroom", count: 5, nextStepId: 4 },
		],
		dialogId: "dinosaure_01",
	},
];

// export const sceneDescription = [
// 	{
// 		// scène 0 d'introduction
// 		name: "introduction",
// 		steps: [
// 			{
// 				dialogId: "introduction",
// 				callbackName: "onIntroductionCompleted",
// 				completionCondition: 1500,
// 			},
// 		],
// 	},
// 	{
// 		// scène 1 : dinosaure
// 		name: "dinosaureBox",
// 		steps: [
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "dinosaure",
// 						resourceName: "mushroomPaintedModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 				],
// 				dialogId: "dinosaure_01",
// 				callbackName: "onDinosaure01Completed",
// 			},
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "dinosaure",
// 						resourceName: "mushroomPaintedModel",
// 						triggerCount: 5,
// 						isActive: true,
// 					},
// 				],
// 				dialogId: "dinosaure_01",
// 				callbackName: "onDinosaure02Completed",
// 			},
// 		],
// 	},
// 	{
// 		// scène 2 : carnet
// 		name: "classroomBox",
// 		steps: [
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "carnet",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 				],
// 				dialogId: "classroom_01",
// 				callbackName: "onClassroom01Completed",
// 			},
// 		],
// 	},

// 	{
// 		// Scène 3 : herbier
// 		name: "herbariumBox",
// 		steps: [
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "herbier",
// 						resourceName: "mushroomPaintedModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 				],
// 				dialogId: "herbarium_01",
// 				callbackName: "onHerbarium01Completed",
// 			},
// 		],
// 	},

// 	{
// 		name: "gardenBedroom",
// 		steps: [
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "flower",
// 						resourceName: "mushroomModel",
// 						triggerCount: null,
// 						isActive: true,
// 					},
// 					{
// 						objectId: "vines",
// 						resourceName: "mushroomModel",
// 						triggerCount: null,
// 						isActive: true,
// 					},
// 					{
// 						objectId: "grass",
// 						resourceName: "mushroomModel",
// 						triggerCount: null,
// 						isActive: true,
// 					},
// 				],
// 				objectsRemoved: ["herbier", "carnet", "dinosaure"],
// 				completionCondition: {
// 					objectId: ["flower", "vines", "grass"],
// 					count: 10,
// 				},
// 				dialogId: "gardenbedroom_01",
// 				callbackName: "onGardenBedroom01Completed",
// 			},
// 		],
// 	},

// 	{
// 		name: "enterClairvoyantForest",
// 		steps: [
// 			{
// 				dialogId: "enterClairvoyantForest_01",
// 				callbackName: "onEnterClairvoyantForestCompleted",
// 			},
// 		],
// 	},

// 	{
// 		name: "clairvoyantForest",
// 		steps: [
// 			// TRANSFORMATION BUTTERFLY -> FAIRY
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "butterfly",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 				],
// 				dialogId: "forestButterfly_01",
// 				callbackName: "onForestButterfly01Completed",
// 			},
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "butterfly",
// 						resourceName: "mushroomModel",
// 						triggerCount: 5,
// 						isActive: true,
// 					},
// 				],
// 				replaceObjects: [
// 					{
// 						objectId: "fairy",
// 						resourceName: "mushroomModel",
// 					},
// 				],
// 				dialogId: "forestButterfly_02",
// 				callbackName: "onForestButterfly02Completed",
// 			},
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "fairy",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: false,
// 					},
// 				],
// 				dialogId: "forestFairy_01",
// 				callbackName: "onForestFairy01Completed",
// 			},
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "fairy",
// 						resourceName: "mushroomModel",
// 						triggerCount: 5,
// 						isActive: false,
// 					},
// 				],
// 				dialogId: "forestFairy_02",
// 				callbackName: "onForestFairy02Completed",
// 			},

// 			// TRANSFORMATION FLOWER -> BIG BIG FLOWERS
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "flower",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 				],
// 				dialogId: "forestLittleFlower_01",
// 				callbackName: "onForestLittleFlower01Completed",
// 			},
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "flower",
// 						resourceName: "mushroomModel",
// 						triggerCount: 5,
// 						isActive: true,
// 					},
// 				],
// 				replaceObjects: [
// 					{
// 						objectId: "exoticFlower01",
// 						resourceName: "mushroomModel",
// 					},
// 					{
// 						objectId: "exoticFlower02",
// 						resourceName: "mushroomModel",
// 					},
// 					{
// 						objectId: "exoticFlower03",
// 						resourceName: "mushroomModel",
// 					},
// 				],
// 				dialogId: "forestLittleFlower_02",
// 				callbackName: "onForestLittleFlower02Completed",
// 			},
// 			{
// 				completionCondition: {
// 					objectId: ["exoticFlower01", "exoticFlower02", "exoticFlower03"],
// 					count: 10,
// 				},
// 				dialogId: "forestExoticFlower_01",
// 				callbackName: "onForestExoticFlower01Completed",
// 			},
// 		],
// 	},
// 	{
// 		name: "afterBigFlower",
// 		steps: [
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "pineCone",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 					{
// 						objectId: "oiseau",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 				],
// 				objectsRemoved: [
// 					"exoticFlower01",
// 					"exoticFlower02",
// 					"exoticFlower03",
// 					"fairy",
// 					"flower",
// 					"vines",
// 					"grass",
// 					"butterfly",
// 				],
// 				dialogId: "afterBigFlower_01",
// 				callbackName: "onAfterBigFlower01Completed",
// 			},
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "fox",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 				],
// 				replaceObjects: [
// 					{
// 						objectId: "elf",
// 						resourceName: "mushroomModel",
// 					},
// 				],
// 				dialogId: "forestFox_01",
// 				callbackName: "onForestFox01Completed",
// 			},
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "elf",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: false,
// 					},
// 				],
// 				dialogId: "forestElf_02",
// 				callbackName: "onForestElf02Completed",
// 			},
// 		],
// 	},
// 	{
// 		name: "storm",
// 		steps: [
// 			{
// 				objectsRemoved: [
// 					"fairy",
// 					"flower",
// 					"vines",
// 					"grass",
// 					"exoticFlower01",
// 					"exoticFlower02",
// 					"exoticFlower03  ",
// 					"butterfly",
// 					"pineCone",
// 					"oiseau",
// 					"fox",
// 					"elf",
// 				],
// 				dialogId: "forestStorm_01",
// 				callbackName: "onStorm01Completed",
// 			},
// 		],
// 	},
// 	{
// 		name: "duringStorm",
// 		steps: [
// 			{
// 				objectsAdded: [
// 					{
// 						objectId: "bramble",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 					{
// 						objectId: "toxicMushroom",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 					{
// 						objectId: "ant",
// 						resourceName: "mushroomModel",
// 						triggerCount: 1,
// 						isActive: true,
// 					},
// 				],
// 				objectsRemoved: [
// 					"pineCone",
// 					"elf",
// 					"fox",
// 					"oiseau",
// 					"flower",
// 					"vines",
// 					"grass",
// 					"exoticFlower01",
// 					"exoticFlower02",
// 					"exoticFlower03",
// 					"fairy",
// 					"butterfly",
// 				],
// 				dialogId: "forestStorm_01",
// 				callbackName: "onDuringStorm01Completed",
// 			},
// 		],
// 	},
// ];
