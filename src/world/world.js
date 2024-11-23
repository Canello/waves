import { Background } from "./background.js";
import { Screen } from "../screen/screen.js";

export class World {
    static instance;

    constructor() {
        if (!World.instance) {
            World.instance = this;

            this.background = new Background();
            this.forms = [];
        }

        return World.instance;
    }

    start() {
        this.stateLoop();
        this.renderingLoop();
    }

    stateLoop() {
        this.tick();
        setTimeout(this.stateLoop.bind(this), 50);
    }

    renderingLoop() {
        new Screen().clear();
        this.background.render();
        requestAnimationFrame(this.renderingLoop.bind(this));
    }

    tick() {
        this.background.resetDistortions();
        for (let form of this.forms) {
            form.distort();
        }
    }

    addForm(form) {
        this.forms.push(form);
    }

    deleteForm(x, y) {
        for (let i = 0; i < this.forms.length; i++) {
            const form = this.forms[i];
            if (form.intersects(x, y)) {
                this.forms.splice(i, 1);
                return;
            }
        }
    }

    getFirstFormThatIntersectsWith(x, y) {
        for (let form of this.forms) {
            if (form.intersects(x, y)) return form;
        }
    }
}
