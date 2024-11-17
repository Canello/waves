import { Background } from "./background.js";
import { Piece } from "./form.js";

export class World {
    constructor() {
        this.background = new Background();
        this.forms = [new Piece(100, 100, 200, 200)];
    }

    start() {
        this.applyDistortions();
        this.background.render();
    }

    applyDistortions() {
        for (let form of this.forms) {
            form.distort();
        }
    }
}
