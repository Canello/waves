import { UserInterface } from "./screen/user-interface.js";
import { assembleBody } from "./world/assemble-body.js";
import { Piece } from "./world/form.js";
import { World } from "./world/world.js";

const world = new World();
new UserInterface();
world.addForm(assembleBody());
world.addForm(new Piece(0, 0, 800, 400));
world.addForm(new Piece(1188, 0, 100, 100));
world.addForm(new Piece(0, 768, 100, 100));
world.addForm(new Piece(1188, 768, 100, 100));
world.start();

// next
// add new kind of Piece that has no width and height, only a distribution of mass, which is used for calculating the distortion
// make width and height modifiers work on body
// add body assembler in user interface
// add layer system for picking Pieces
// add GUI menu
