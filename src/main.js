import { assembleBody } from "./world/assemble-body.js";
import { World } from "./world/world.js";

const world = new World();
world.addForm(assembleBody());
world.start();
