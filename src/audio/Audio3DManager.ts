import { EventEmitter } from "@plugins/baseExperience";
import { Howl, Howler } from 'howler';

export default class Audio3DManager extends EventEmitter {

    constructor() {
        super()
    }

    // Play spatial sound
    playSpatialAudio(audioSrc: string, position: { x: number, y: number, z: number }, loop: boolean = false) {
        const sound = new Howl({
            src: [audioSrc],
            loop: loop,
            volume: 15.0,

        });

        sound.pos(position.x, position.y, position.z);
        sound.play();
        console.log("coucou")
    }
}