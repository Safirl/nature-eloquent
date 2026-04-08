import './reset.css'
import './style.css'
import { FirstPersonCamera } from 'first-person-plugin'
import { TemplateWorld } from 'base-experience'
import { Experience } from 'base-experience'
import { templateSources } from 'base-experience'
import { type InputProfile } from 'base-experience'
import { keyboardProfile, BitControllerProfile } from 'first-person-plugin'

const init = () => {
  const canvas: HTMLCanvasElement = document.getElementById("three") as HTMLCanvasElement
  if (!canvas) {
    console.error('no canvas found with three identifier')
    return;
  }
  
  canvas.style.width = "100%"
  canvas.style.height = "100%"
  const camera = new FirstPersonCamera()
  const world = new TemplateWorld()
  const experience = new Experience(canvas, templateSources, camera, world)
  const profiles: InputProfile[] = [keyboardProfile, BitControllerProfile]

  experience.inputSystem.addInputProfiles(profiles)
  // experience.inputSystem.on("jump", (args: InputEventArgs) => {
  //   const gamepad = args.controller as Gamepad
  //   console.log("controller: ", gamepad.id, " triggered: ", args.type)
  // })
}  

init()