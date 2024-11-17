export class Screen {
    static instance;

    constructor() {
        if (!Screen.instance) {
            Screen.instance = this;

            this.canvas = document.getElementById("canvas");
            this.fixDpr(this.canvas);

            this.c = this.canvas.getContext("2d");
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }

        return Screen.instance;
    }

    fixDpr(canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
    }

    clear() {
        this.c.clearRect(0, 0, this.width, this.height);
    }
}
