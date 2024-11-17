import { Screen } from "../screen/screen.js";
import { transpose } from "../utils/math.js";

export class Background {
    static instance;

    constructor() {
        if (!Background.instance) {
            Background.instance = this;
            const screen = new Screen();
            this.numRows = 100;
            this.numCols = 100;
            this.rowGap = screen.height / (this.numRows - 1);
            this.colGap = screen.width / (this.numCols - 1);
            this.grid = this.makeGrid();
        }

        return Background.instance;
    }

    makeGrid() {
        const grid = [];

        for (let i = 0; i < this.numRows; i++) {
            const row = [];

            for (let j = 0; j < this.numCols; j++) {
                const x = this.colGap * j;
                const y = this.rowGap * i;
                row.push(new Point(x, y));
            }

            grid.push(row);
        }

        return grid;
    }

    render() {
        this.renderRows();
        this.renderCols();
    }

    renderRows() {
        const c = new Screen().c;

        for (let row of this.grid) {
            if (row.length < 2) return;

            c.beginPath();
            c.moveTo(row[0].xDistorted, row[0].yDistorted);

            for (let i = 1; i < row.length; i++) {
                c.lineTo(row[i].xDistorted, row[i].yDistorted);
                c.fillStyle = "white";
            }

            c.strokeStyle = "white";
            c.lineWidth = 1;
            c.stroke();
        }
    }

    renderCols() {
        const c = new Screen().c;
        const gridT = transpose(this.grid);

        for (let col of gridT) {
            if (col.length < 2) return;

            c.beginPath();
            c.moveTo(col[0].xDistorted, col[0].yDistorted);

            for (let i = 1; i < col.length; i++) {
                c.lineTo(col[i].xDistorted, col[i].yDistorted);
                c.fillStyle = "white";
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

        const jMin = Math.ceil(xMin / this.colGap);
        const jMax = Math.floor(xMax / this.colGap);
        const iMin = Math.ceil(yMin / this.rowGap);
        const iMax = Math.floor(yMax / this.rowGap);

        const points = [];

        for (let i = iMin; i <= iMax; i++) {
            for (let j = jMin; j <= jMax; j++) {
                points.push(this.grid[i][j]);
            }
        }

        return points;
    }

    resetDistortions() {
        this.grid.forEach((row) =>
            row.forEach((point) => point.resetDistortion())
        );
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
