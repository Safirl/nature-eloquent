import { Environment, Experience, Floor, World } from "@plugins/baseExperience";
import Wall from "../objects/Wall";


export default class CollisionTemplateWorld extends World {
  declare experience: Experience;
  declare environment: Environment;
  declare resources: Experience["resources"];
  declare floor: Floor;
  declare wall: Wall;

  init() {
    super.init();
    this.floor = new Floor();
    this.floor.mesh.position.y = -5;
    this.wall = new Wall();
    this.wall.mesh.position.y = -5;
    this.environment = new Environment();

    const collisionManager = Experience.instance?.collisionManager
    if (!collisionManager) throw new Error("CollisionTemplateWorld initialization failed: CollisionManager is not available.");
    collisionManager?.addCollisionObjects([this.floor]);
    collisionManager?.addCollisionObjects([this.wall]);
  }
}
