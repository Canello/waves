import { Piece, Wave } from "../world/form.js";
import { World } from "../world/world.js";
import { Screen } from "./screen.js";

export class UserInterface {
    constructor() {
        this.mouseHandler = new MouseHandler();
        this.keyboardHandler = new KeyboardHandler();
    }
}

class MouseHandler {
    static instance;

    constructor() {
        if (!MouseHandler.instance) {
            MouseHandler.instance = this;

            this.isPressed = false;
            this.x = 0;
            this.y = 0;
            this.screen = new Screen();
            this.setup();
        }

        return MouseHandler.instance;
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
        const [x, y] = this.normalizeMouseCoordinates(
            event.offsetX,
            event.offsetY
        );

        const deltaX = x - this.x;
        const deltaY = y - this.y;

        this.x = x;
        this.y = y;

        if (!this.isPressed) return;

        const form = this.getFormUnderneathMouse();
        if (form) {
            form.x = form.x + deltaX;
            form.y = form.y + deltaY;
        }
    }

    normalizeMouseCoordinates(x, y) {
        // Normalize mouse coordinates to match the canvas's internal resolution
        const dpr = this.screen.dpr;
        const xNormalized = x * dpr;
        const yNormalized = y * dpr;
        return [xNormalized, yNormalized];
    }

    getFormUnderneathMouse() {
        const world = new World();
        const form = world.getFirstFormThatIntersectsWith(this.x, this.y);
        return form;
    }
}

class KeyboardHandler {
    static instance;

    constructor() {
        if (!KeyboardHandler.instance) {
            KeyboardHandler.instance = this;

            this.world = new World();
            this.mouseHandler = new MouseHandler();
            this.screen = new Screen();
            this.keyUpStrategies = this.makeKeyUpStrategies();
            this.keyDownStrategies = this.makeKeyDownStrategies();
            this.setup();
        }

        return KeyboardHandler.instance;
    }

    setup() {
        document.addEventListener("keyup", ({ key }) => {
            const strategy = this.keyUpStrategies[key];
            if (strategy) strategy();
        });

        document.addEventListener("keydown", ({ key }) => {
            const strategy = this.keyDownStrategies[key];
            if (strategy) strategy();
        });
    }

    makeKeyUpStrategies() {
        const p = this.createPieceOnMouseLocation.bind(this);
        const x = this.deletePieceOnMouseLocation.bind(this);
        return {
            p,
            x,
        };
    }

    makeKeyDownStrategies() {
        const q = this.decreasePieceWidthBy10.bind(this);
        const w = this.increasePieceWidthBy10.bind(this);
        const a = this.decreasePieceHeightBy10.bind(this);
        const s = this.increasePieceHeightBy10.bind(this);
        const r = this.addMassToMouseLocation.bind(this);
        const e = this.subtractMassFromMouseLocation.bind(this);
        return {
            q,
            w,
            a,
            s,
            r,
            e,
        };
    }

    createPieceOnMouseLocation() {
        const defaultWidth = 50;
        const defaultHeight = 50;
        const piece = new Piece(
            this.mouseHandler.x - defaultWidth / 2,
            this.mouseHandler.y - defaultHeight / 2,
            defaultWidth,
            defaultHeight
        );
        this.world.addForm(piece);
    }

    deletePieceOnMouseLocation() {
        this.world.deleteForm(this.mouseHandler.x, this.mouseHandler.y);
    }

    decreasePieceWidthBy10() {
        const form = this.mouseHandler.getFormUnderneathMouse();
        if (!form) return;
        if (form.width < 11) return;
        form.width = form.width - 10;
        form.x = form.x + 5;
    }

    increasePieceWidthBy10() {
        const form = this.mouseHandler.getFormUnderneathMouse();
        if (!form) return;
        form.width = form.width + 10;
        form.x = form.x - 5;
    }

    decreasePieceHeightBy10() {
        const form = this.mouseHandler.getFormUnderneathMouse();
        if (!form) return;
        if (form.height < 11) return;
        form.height = form.height - 10;
        form.y = form.y + 5;
    }

    increasePieceHeightBy10() {
        const form = this.mouseHandler.getFormUnderneathMouse();
        if (!form) return;
        form.height = form.height + 10;
        form.y = form.y - 5;
    }

    addMassToMouseLocation() {
        const wave = new Wave();
        wave.addMass(this.mouseHandler.x, this.mouseHandler.y, 1);
    }

    subtractMassFromMouseLocation() {
        const wave = new Wave();
        wave.subtractMass(this.mouseHandler.x, this.mouseHandler.y, 1);
    }
}
