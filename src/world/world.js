import { Background } from "./background.js";

export class World {
    constructor() {
        this.background = new Background();
        this.forms = [];
    }

    start() {
        this.background.render();
    }
}
