import { UserInterface } from "./screen/user-interface.js";
import { assembleBody } from "./world/assemble-body.js";
import { Piece, Wave } from "./world/form.js";
import { World } from "./world/world.js";

const world = new World();
new UserInterface();
world.addForm(assembleBody());
world.addForm(new Piece(20, 20, 800, 400));
world.addForm(new Piece(1188, 0, 100, 100));
world.addForm(new Piece(0, 768, 100, 100));
world.addForm(new Piece(1100, 400, 100, 100));
world.addForm(new Wave(0));
world.start();

// next
// add new kind of Piece that has no width and height, only a distribution of mass, which is used for calculating the distortion
// add colors
// add layer system for picking Pieces
// PNG to distortion
// add GUI menu
