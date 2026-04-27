import "./assets/reset.css";
import "./assets/style.css";
import { Experience } from "@plugins/baseExperience";
import sources from "./resources/sources";
import { type InputProfile } from "@plugins/baseExperience";
import { keyboardProfile } from "./resources/inputProfiles";
import BookInteraction from "./books/BookInteraction";
import Playground from "./world/PlaygroundWorld";
import OrbitPlayer from "./camera/OrbitPlayer";
import SubtitleManager from "./subtitle/SubtitleManager";

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
  const camera = new OrbitPlayer();
  const world = new Playground();
  const experience = new Experience(canvas, sources, camera, world);
  const subtitleManager = new SubtitleManager();
  // const profiles: InputProfile[] = [keyboardProfile];
  // const book = new BookInteraction();

  // experience.inputSystem.addInputProfiles(profiles);
};

init();
