import "./reset.css";
import "./style.css";
import {FirstPersonCameraOctree} from "@plugins/firstPersonCamera";
import {Experience} from "@plugins/baseExperience";
import sources from "./resources/sources";
import { type InputProfile } from "@plugins/baseExperience";
import { keyboardProfile } from "./resources/inputProfiles";
import BlockingWorld from "./world/Blocking";
import Player from "./player/Player";
import BookInteraction from "./books/BookInteraction";

const init = () => {
  const canvas: HTMLCanvasElement = document.getElementById(
    "three",
  ) as HTMLCanvasElement;
  if (!canvas) {
    console.error("no canvas found with three identifier");
    return;
  }

  canvas.style.width = "100%";
  canvas.style.height = "100%";
  const camera = new FirstPersonCameraOctree(1.27);
  const world = new BlockingWorld();
  const experience = new Experience(canvas, sources, camera, world);
  const profiles: InputProfile[] = [keyboardProfile];
  const book = new BookInteraction();

  experience.inputSystem.addInputProfiles(profiles);
};

init();
