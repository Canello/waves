import { World } from "../world/world.js";
import { Screen } from "./screen.js";

export class UserInterface {
    constructor() {
        this.mouseHandler = new MouseHandler();
    }
}

class MouseHandler {
    constructor() {
        this.isPressed = false;
        this.x = 0;
        this.y = 0;
        this.screen = new Screen();
        this.setup();
    }

    setup() {
        const canvas = this.screen.canvas;
        canvas.addEventListener("mousedown", this.press.bind(this));
        canvas.addEventListener("mouseup", this.release.bind(this));
        canvas.addEventListener("mousemove", this.onMove.bind(this));
    }

    press() {
        this.isPressed = true;
    }

    release() {
        this.isPressed = false;
    }

    onMove(event) {
        // Normalize mouse coordinates to match the canvas's internal resolution
        const dpr = this.screen.dpr;
        const x = event.offsetX * dpr;
        const y = event.offsetY * dpr;

        const deltaX = x - this.x;
        const deltaY = y - this.y;

        this.x = x;
        this.y = y;

        if (!this.isPressed) return;

        const world = new World();
        const form = world.getFirstFormThatIntersectsWith(this.x, this.y);
        if (form) {
            form.x = form.x + deltaX;
            form.y = form.y + deltaY;
        }
    }
}
