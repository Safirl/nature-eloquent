import { EventEmitter, Experience } from "@plugins/baseExperience";

export default class AudioManager extends EventEmitter {
	public audios: { audio: HTMLAudioElement; src: string; volume: number }[] = [];
	declare experience: Experience;
	declare currentAmbient: { audio: HTMLAudioElement | null; src: string; volume: number } | null;

	constructor() {
		super();
		if (!Experience.instance) throw new Error("AudioManager: Experience is not initialized");
		this.experience = Experience.instance;
		this.init();
		this.currentAmbient = null;
	}

	init() {}

	// Juste pour le son d'ambiance -> pour avoir une transition plus smooth entre les deux musique (forêt -> orage)
	async playAmbient(audioSrc: string, volume: number = 1) {
		if (this.currentAmbient) {
			await this.stopAudio(this.currentAmbient.src, true);
		}
		if (!audioSrc) return;
		this.currentAmbient = {
			audio: this.playAudio(audioSrc, true, volume, 0, true) ?? null,
			src: audioSrc,
			volume,
		};
	}

	playAudio(
		audioSrc: string,
		loop: boolean = false,
		volume: number = 1,
		startDelay: number = 0,
		fadeIn: boolean = false
	) {
		if (!audioSrc) return;

		const audio = new Audio(audioSrc);
		audio.preload = "auto";
		audio.loop = loop;
		audio.volume = fadeIn ? 0 : volume;

		setTimeout(() => {
			audio.play();
			this.audios.push({ audio, src: audioSrc, volume });
			if (fadeIn) {
				this.easingAudio(audio, true, 2000, volume);
			}
		}, startDelay);

		if (!loop) {
			audio.addEventListener("ended", () => {
				this.audios = this.audios.filter((a) => a.audio !== audio);
			});
		}

		return audio;
	}

	// Stopper un son avec fondu si souhaité
	async stopAudio(audioSrc: string, fade: boolean = false) {
		const found = this.audios.find((a) => a.src === audioSrc);
		if (!found) return;
		if (fade) {
			await this.easingAudio(found.audio, false);
		}
		found.audio.pause();
		found.audio.currentTime = 0;
		this.audios = this.audios.filter((a) => a !== found);

		if (this.currentAmbient?.src === audioSrc) {
			this.currentAmbient = null;
		}
	}

	// Fonction pour faire un fondu
	async easingAudio(
		audio: HTMLAudioElement,
		fadeIn: boolean = false,
		duration: number = 2000,
		targetVolume: number = 1
	) {
		const steps = 100;

		if (fadeIn) {
			audio.volume = 0;
			for (let i = 0; i <= steps; i++) {
				// console.log("volume1:", audio.volume);
				audio.volume = (i / steps) * targetVolume;
				await this.delayAfterNextAudio(duration / steps);
			}
		} else {
			const initialVolume = audio.volume;
			for (let i = 0; i <= steps; i++) {
				// console.log("volume2:", audio.volume);
				audio.volume = initialVolume * (1 - i / steps);
				await this.delayAfterNextAudio(duration / steps);
			}
		}
	}

	// Bruit de pas -> fonction qui attend que l'audio soit terminé (pour éviter de lancer le son des pas trop de fois)
	async playFootStepAudio(audioSrc: string, volume: number = 1) {
		await new Promise((resolve) => {
			const audio = new Audio(audioSrc);
			audio.preload = "auto";
			audio.playbackRate = 1;
			audio.volume = volume;

			audio.play();
			audio.addEventListener("ended", () => {
				resolve(undefined);
			});
		});
	}

	delayAfterNextAudio(duration: number = 100) {
		return new Promise((resolve) => setTimeout(resolve, duration));
	}

	// setupDebug(entry: { audio: HTMLAudioElement, src: string, volume: number }) {
	//     if (!this.experience.debug.active) return;
	//     if (!this.experience.debug.ui) return;

	//     const folder = this.experience.debug.ui.addFolder(entry.src);
	//     folder.add(entry, "volume", 0, 1, 0.01)
	//         .name("volume")
	//         .onChange((v: number) => {
	//             entry.audio.volume = v;
	//         });
	// }
}
