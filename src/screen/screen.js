export class Screen {
    static instance;

    constructor() {
        if (!Screen.instance) {
            Screen.instance = this;

            this.canvas = document.getElementById("canvas");
            this.dpr = window.devicePixelRatio || 1;
            this.canvas.width = this.canvas.clientWidth * this.dpr;
            this.canvas.height = this.canvas.clientHeight * this.dpr;

            this.c = this.canvas.getContext("2d");
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }

        return Screen.instance;
    }

    clear() {
        this.c.clearRect(0, 0, this.width, this.height);
    }

    static xBounded(x) {
        const screen = new Screen();
        x = x < 0 ? 0 : x;
        x = x > screen.width ? screen.width : x;
        return x;
    }

    static yBounded(y) {
        const screen = new Screen();
        y = y < 0 ? 0 : y;
        y = y > screen.height ? screen.height : y;
        return y;
    }
}
