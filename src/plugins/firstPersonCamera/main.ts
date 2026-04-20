import "./reset.css";
import "./style.css";
import {
  Experience,
  TemplateWorld,
  type InputEventArgs,
  type InputProfile,
} from "@plugins/baseExperience";
import { templateSources } from "@plugins/baseExperience";
import FirstPersonCamera from "./camera/FirstPersonCamera";
import {
  BitControllerProfile,
  keyboardProfile,
} from "./templates/inputs/inputProfiles";
import CollisionTemplateWorld from "./templates/world/CollisionTemplateWorld";
import FirstPersonCameraOctree from "./camera/FirstPersonCameraOctree";

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

  // const world = new TemplateWorld();
  const natureWorld = new CollisionTemplateWorld();

  const camera = new FirstPersonCameraOctree();
  const experience = new Experience(
    canvas,
    templateSources,
    camera,
    natureWorld,
  );
  const profiles: InputProfile[] = [keyboardProfile, BitControllerProfile];

  experience.inputSystem.addInputProfiles(profiles);
  // experience.inputSystem.on("left", (args: InputEventArgs) => {
  //   const gamepad = args.controller as Gamepad
  //   if (typeof args.controller === typeof Gamepad) {
  //     console.log("controller: ", gamepad.id, " triggered: ", args.type)
  //   } else {
  //     console.log("controller: ", args.controller, " triggered: ", args.type)
  //   }
  // })
};

init();
