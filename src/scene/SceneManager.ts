import { EventEmitter, type LifeTimeObject } from "@plugins/baseExperience";
import type Menu from "../menu";
import { stepDescription } from "./sceneDescriptions";
import type { DialogStep, ObjectCountCondition } from "./sceneDescriptions";

export default class SceneManager extends EventEmitter implements LifeTimeObject {
	// private currentSceneId: number = 0;
	//On manipule les completionConditions des active step. Si elles sont vides on remove la step
	private activeSteps: DialogStep[];
	private objectCounts: { [key: string]: number } = {};
	private isDialogPlaying: boolean = false;

	declare private menu: Menu;

	constructor(menu: Menu) {
		super();
		this.activeSteps = [];
		this.menu = menu;
		this.menu.on("onObjectPlaced", this.onObjectPlaced);
	}
	init = () => {
		this.bindToDialogEvents();
		this.addActiveStep(0);
	};
	update = () => {};
	destroy = () => {};

	bindToDialogEvents() {
		this.menu.subtitle.on("dialogFinished.sceneManager", () => {
			this.isDialogPlaying = false;
		});
		this.menu.subtitle.on("dialogStarted.sceneManager", () => {
			this.isDialogPlaying = true;
		});
	}

	onObjectPlaced = (objectName: string) => {
		if (this.isDialogPlaying) return;
		if (!this.objectCounts[objectName]) {
			this.objectCounts[objectName] = 0;
		}
		this.objectCounts[objectName]++;
		let relatedActiveStep = {} as DialogStep;
		let relatedCompletionCondition = {} as ObjectCountCondition;

		//1. Trouver la completionCondtionCorrespondante + step correspondante
		this.activeSteps.forEach((s) => {
			if (Array.isArray(s.completionConditions)) {
				s.completionConditions.forEach((cc) => {
					if (cc.objectId === objectName) {
						relatedActiveStep = s;
						relatedCompletionCondition = cc;
					}
				});
			}
		});

		if (!relatedActiveStep || !relatedCompletionCondition) return;

		let isCompletionConditionArrayEmpty = false;
		let isCompletionConditionRemoved = false;
		//2. Retirer la completionCondtion si elle est atteinte;
		if (relatedCompletionCondition.count === this.objectCounts[objectName]) {
			if (Array.isArray(relatedActiveStep.completionConditions)) {
				const index = relatedActiveStep.completionConditions.indexOf(
					relatedCompletionCondition
				);
				if (index > -1) {
					relatedActiveStep.completionConditions.splice(index, 1);
					isCompletionConditionRemoved = true;
				}
				isCompletionConditionArrayEmpty = relatedActiveStep.completionConditions.length < 1;
			}
		}

		//Si aucun completionCondition a été atteinte on return
		if (!isCompletionConditionRemoved) return;

		//3. si toutes les completionCondition sont atteintes supprimer la active step
		if (isCompletionConditionArrayEmpty) {
			const index = this.activeSteps.indexOf(relatedActiveStep);
			if (index > -1) {
				this.activeSteps.splice(index, 1);
			}
		}

		if (relatedCompletionCondition.callbackName) {
			this.trigger(relatedCompletionCondition.callbackName);
		}

		//4. Trigger next step s'il y en a une
		if (!relatedCompletionCondition.nextStepId) return;
		this.addActiveStep(relatedCompletionCondition.nextStepId);
	};

	addActiveStep = (stepId: number) => {
		const staticStep = stepDescription.find((s) => s.id === stepId);
		if (!staticStep) {
			console.warn("Step not found with id:", stepId);
			return;
		}
		let newActiveStep = {} as DialogStep;
		newActiveStep = Object.assign(newActiveStep, staticStep);
		if (!Array.isArray(newActiveStep.completionConditions)) {
			this.menu.subtitle.on("dialogFinished.condition", () => {
				setTimeout(() => {
					this.addActiveStep(newActiveStep.completionConditions.nextStepId);
					this.menu.subtitle.off(".condition");
				}, newActiveStep.completionConditions.delay);
			});
		}
		this.activeSteps.push(newActiveStep);
		this.trigger("onActiveStepAdded", [newActiveStep]);
	};
}
