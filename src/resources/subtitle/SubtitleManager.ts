import { EventEmitter } from "@plugins/baseExperience";
import type { DialogStep } from "../../scene/sceneDescriptions";
import AudioManager from "../../audio/Audio2DManager";

type DialogSubtitleStep = {
	audio: string;
	dialog: string;
	speaker: string;
};

type DialogInteraction = Record<string, DialogSubtitleStep>;

export default class SubtitleManager extends EventEmitter {
	declare subtitleElement: HTMLElement;
	declare dialogElement: HTMLElement;
	declare characterElement: HTMLElement;
	declare currentIndex: number;
	declare typingInterval: number | null;
	declare audioManager: AudioManager;

	constructor() {
		super();
		this.subtitleElement = document.getElementById("subtitle") as HTMLElement;
		this.dialogElement = document.getElementById("dialog") as HTMLElement;
		this.characterElement = document.getElementById("character") as HTMLElement;
		this.subtitleElement.style.opacity = "0";

		this.audioManager = new AudioManager();
		this.typingInterval = null;
	}

	init() { }

	showSubtitle(text: string, characterName: string, audioSrc: string) {
		if (!this.subtitleElement) return;
		// this.subtitleElement.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
		// this.subtitleElement.style.transition = "opacity 0.1s ease-in-out";
		this.subtitleElement.style.opacity = "1";
		this.typeText(text);
		this.characterElement.textContent = characterName;
		this.characterElement.style.color = characterName === "Clémentine:" ? "#FF9500" : "#00596F";
		// this.audioManager.playAudio(audioSrc, false, 1);
		return this.audioManager.playAudio(audioSrc, false, 1);
	}

	typeText(text: string, speed: number = 35) {
		if (this.typingInterval) clearInterval(this.typingInterval);
		this.dialogElement.textContent = "";
		let i = 0;

		this.typingInterval = setInterval(() => {
			this.dialogElement.textContent += text[i];
			i++;
			if (i >= text.length) {
				clearInterval(this.typingInterval!);
				this.typingInterval = null;
			}
		}, speed);
	}

	hideSubtitle() {
		if (!this.subtitleElement) return;
		// this.subtitleElement.style.transition = "opacity 0.5s ease-in-out";
		this.subtitleElement.style.opacity = "0";
	}

	// Changement de dialogue automatique
	async displayDialog(dialogData: DialogInteraction, relatedStep?: DialogStep) {
		const entries = Object.entries(dialogData);
		if (entries.length === 0) return;
		this.trigger("dialogStarted");

		for (const [_key, item] of entries) {
			const audio = this.showSubtitle(item.dialog, item.speaker, item.audio);
			if (audio) {
				await new Promise<void>((resolve) => {
					audio.addEventListener("ended", () => resolve(), { once: true });
					audio.addEventListener("error", () => resolve(), { once: true });
				});
			}
		}
		// console.log("relatedStep", relatedStep);
		this.hideSubtitle();
		this.trigger("dialogFinished");
	}

	// Changement dialogue au clic
	displayDialogOnClick(dialogData: DialogInteraction) {
		const entries = Object.entries(dialogData);
		if (entries.length === 0) return;
		this.currentIndex = 0;

		const clickNextDialogHandler = () => {
			if (this.currentIndex < entries.length) {
				const [_key, item] = entries[this.currentIndex];
				this.showSubtitle(item.dialog, item.speaker, item.audio);
				this.currentIndex++;
			} else {
				this.hideSubtitle();
				document.removeEventListener("click", clickNextDialogHandler);
			}
		};
		document.addEventListener("click", clickNextDialogHandler);
	}
}
