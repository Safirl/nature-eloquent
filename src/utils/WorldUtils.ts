import { Experience } from "base-experience"
import { Camera } from "three";

export const findPlayerCamera = (): Camera | undefined => {
    if (!Experience.instance) return undefined;
    const player = Experience.instance.scene.children.find((c) => c instanceof Camera)
    return player
}