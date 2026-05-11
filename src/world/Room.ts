import { Experience, type LifeTimeObject } from "@plugins/baseExperience";
import type GUI from "lil-gui";
import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import LavaLamp from "./LavaLamp";

export default class Room {
    declare lavalamp: LavaLamp

    constructor() {
        this.lavalamp = new LavaLamp()
    }

    init() {
        this.lavalamp.init()
    }


    update() {
        this.lavalamp.update()
    }

}