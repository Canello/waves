import { Screen } from "../screen/screen.js";

export class Background {
    static instance;

    constructor() {
        if (!Background.instance) {
            Background.instance = this;
            this.grid = this.makeGrid();
        }

        return Background.instance;
    }

    makeGrid() {
        const numRows = 50;
        const numCols = 50;
        const grid = [];
        const screen = new Screen();

        for (let i = 0; i < numRows; i++) {
            const row = [];

            for (let j = 0; j < numCols; j++) {
                const x = (screen.width / (numCols - 1)) * j;
                const y = (screen.height / (numRows - 1)) * i;
                row.push(new Point(x, y));
            }

            grid.push(row);
        }

        return grid;
    }

    forEachPoint(func) {
        this.grid.forEach((row) => row.forEach((point) => func(point)));
    }

    transpose(matrix) {
        return matrix[0].map((_, colIndex) =>
            matrix.map((row) => row[colIndex])
        );
    }

    render() {
        const c = new Screen().c;
        const gridT = this.transpose(this.grid);

        for (let col of gridT) {
            if (col.length < 2) return;

            c.beginPath();
            c.moveTo(col[0].xDistorted, col[0].yDistorted);

            for (let i = 1; i < col.length; i++) {
                c.lineTo(col[i].xDistorted, col[i].yDistorted);
                c.fillStyle = "white";
                // c.fillRect(col[i].xDistorted - 1, col[i].yDistorted - 1, 2, 2);
            }

            c.strokeStyle = "white";
            c.lineWidth = 1;
            c.stroke();
        }
    }

    getPointsInArea(x1, x2, y1, y2) {
        const xMin = Math.min(x1, x2);
        const xMax = Math.max(x1, x2);
        const yMin = Math.min(y1, y2);
        const yMax = Math.max(y1, y2);

        const points = [];

        return points;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
    }

    get xDistorted() {
        return this.x + this.dx;
    }

    get yDistorted() {
        return this.y + this.dy;
    }

    distort(dx, dy) {
        this.dx = this.dx + dx;
        this.dy = this.dy + dy;
    }

    resetDistortion() {
        this.dx = 0;
        this.dy = 0;
    }
}
