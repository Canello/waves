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
            c.lineWidth = 1;

            for (let i = 0; i < row.length - 1; i++) {
                const startPoint = row[i];
                const finishPoint = row[i + 1];

                // red line
                const kRed = 1.5;
                c.beginPath();
                c.moveTo(
                    startPoint.x + kRed * startPoint.dx,
                    startPoint.yDistorted
                );
                c.lineTo(
                    finishPoint.x + kRed * finishPoint.dx,
                    finishPoint.yDistorted
                );
                c.strokeStyle = "rgba(235, 2, 33, 0.75)";
                c.stroke();

                // blue line
                const kBlue = 2;
                c.beginPath();
                c.moveTo(
                    startPoint.x + kBlue * startPoint.dx,
                    startPoint.yDistorted
                );
                c.lineTo(
                    finishPoint.x + kBlue * finishPoint.dx,
                    finishPoint.yDistorted
                );
                c.strokeStyle = "rgba(66, 209, 237, 0.75)";
                c.stroke();

                // white line
                c.beginPath();
                c.moveTo(startPoint.xDistorted, startPoint.yDistorted);
                c.lineTo(finishPoint.xDistorted, finishPoint.yDistorted);
                c.strokeStyle = "rgba(255, 255, 255, 0.75)";
                c.stroke();
            }
        }
    }

    renderCols() {
        const c = new Screen().c;
        const gridT = transpose(this.grid);

        for (let col of gridT) {
            if (col.length < 2) return;
            c.lineWidth = 1;

            for (let i = 0; i < col.length - 1; i++) {
                const startPoint = col[i];
                const finishPoint = col[i + 1];

                // red line
                // const kRed = 0.75;
                // c.beginPath();
                // c.moveTo(
                //     startPoint.x + kRed * startPoint.dx,
                //     startPoint.yDistorted
                // );
                // c.lineTo(
                //     finishPoint.x + kRed * finishPoint.dx,
                //     finishPoint.yDistorted
                // );
                // c.strokeStyle = "rgba(235, 2, 33, 0.75)";
                // c.stroke();

                // blue line
                // const kBlue = 0.9;
                // c.beginPath();
                // c.moveTo(
                //     startPoint.x + kBlue * startPoint.dx,
                //     startPoint.yDistorted
                // );
                // c.lineTo(
                //     finishPoint.x + kBlue * finishPoint.dx,
                //     finishPoint.yDistorted
                // );
                // c.strokeStyle = "rgba(66, 209, 237, 0.75)";
                // c.stroke();

                // white line
                c.beginPath();
                c.moveTo(startPoint.xDistorted, startPoint.yDistorted);
                c.lineTo(finishPoint.xDistorted, finishPoint.yDistorted);
                c.strokeStyle = "rgba(255, 255, 255, 0.4)";
                c.stroke();
            }
        }
    }

    getPointsInArea(x1, x2, y1, y2) {
        x1 = Screen.xBounded(x1);
        x2 = Screen.xBounded(x2);
        y1 = Screen.yBounded(y1);
        y2 = Screen.yBounded(y2);

        const xMin = Math.min(x1, x2);
        const xMax = Math.max(x1, x2);
        const yMin = Math.min(y1, y2);
        const yMax = Math.max(y1, y2);

        const isZeroSizeArea = (xMax - xMin) * (yMax - yMin) === 0;
        if (isZeroSizeArea) return [];

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

    getClosestPoint(x, y) {
        const [i, j] = this.getClosestPointRowCol(x, y);
        return this.grid[i][j];
    }

    getClosestPointRowCol(x, y) {
        x = Screen.xBounded(x);
        y = Screen.yBounded(y);

        const i = Math.round(y / this.rowGap);
        const j = Math.round(x / this.colGap);

        return [i, j];
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
