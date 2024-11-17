import { Background } from "./background.js";
import { Piece } from "./form.js";
import { Screen } from "../screen/screen.js";

export class World {
    constructor() {
        this.background = new Background();
        this.forms = [new Piece(100, 100, 200, 200)];
    }

    start() {
        this.stateLoop();
        this.renderingLoop();
    }

    stateLoop() {
        this.applyDistortions();
        setTimeout(this.stateLoop.bind(this), 50);
    }

    renderingLoop() {
        new Screen().clear();
        this.background.render();
        requestAnimationFrame(this.renderingLoop.bind(this));
    }

    applyDistortions() {
        this.background.resetDistortions();
        for (let form of this.forms) {
            form.distort();
        }
    }
}
