import { Background } from "./background.js";

export class Piece {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get xc() {
        return this.x + this.width / 2;
    }

    get yc() {
        return this.y + this.height / 2;
    }

    distort() {
        const background = new Background();
        const pointsToDistort = background.getPointsInArea(
            this.x,
            this.x + this.width,
            this.y,
            this.y + this.height
        );

        pointsToDistort.forEach((point) => {
            const [dx, dy] = this.calculateDistortion(point.x, point.y);
            point.distort(dx, dy);
        });
    }

    calculateDistortion(xp, yp) {
        const xpc = this.xc - xp;
        const ypc = this.yc - yp;
        const pc = Math.sqrt(xpc ** 2 + ypc ** 2);
        const xpcMax = this.width / 2;
        const ypcMax = this.height / 2;
        const pcMax = Math.sqrt(
            (this.xc - this.x) ** 2 + (this.yc - this.y) ** 2
        );

        // Distortion factor based on euclidean distance of point to center of piece
        // The CLOSER to the center, the greater the distortion towards the center
        const distortionFactorEuclidean = 1 - pc / pcMax;

        // Distortion factors based on x and y distances of point to center of piece
        // The FURTHER from the center, the greater the distortion towards the center
        const distortionFactorX = Math.abs(xpc / xpcMax);
        const distortionFactorY = Math.abs(ypc / ypcMax);

        // Distortion factor based on randomness and euclidean distance of point to center of piece
        // The CLOSER to the center, the greater the random distortion absolute value
        // Always positive, making distortions are biased to the right (+x) and bottom (+y) of the screen
        const distortionFactorRandom =
            5 * Math.random() * (distortionFactorEuclidean + 1) ** 2;

        // xpc and ypx in equations below add the direction of the distortion and some amplitude
        // as they have signs (not absolute value) and amplitude (not normalized)
        const dx =
            xpc * distortionFactorX * distortionFactorEuclidean +
            distortionFactorRandom;
        const dy =
            ypc * distortionFactorY * distortionFactorEuclidean +
            distortionFactorRandom;

        return [dx, dy];
    }

    intersects(x, y) {
        return (
            this.x <= x &&
            x <= this.x + this.width &&
            this.y <= y &&
            y <= this.y + this.height
        );
    }
}

export class Wave {
    static instance;

    constructor(backgroundNoise = 0) {
        if (!Wave.instance) {
            Wave.instance = this;
            this.massDistributionGrid =
                this.makeMassDistributionGrid(backgroundNoise);
        }

        return Wave.instance;
    }

    makeMassDistributionGrid(backgroundNoise) {
        const background = new Background();
        return Array(background.numRows)
            .fill(0)
            .map((e) => Array(background.numCols).fill(backgroundNoise));
    }

    addMass(x, y, mass) {
        const background = new Background();
        const [i, j] = background.getClosestPointRowCol(x, y);
        this.massDistributionGrid[i][j] += mass;
    }

    subtractMass(x, y, mass) {
        const background = new Background();
        const [i, j] = background.getClosestPointRowCol(x, y);
        const resultingMass = this.massDistributionGrid[i][j] - mass;
        if (resultingMass < 0) return;
        this.massDistributionGrid[i][j] = resultingMass;
    }

    distort() {
        const background = new Background();

        for (let i = 0; i < this.massDistributionGrid.length; i++) {
            const row = this.massDistributionGrid[i];

            for (let j = 0; j < row.length; j++) {
                const point = background.grid[i][j];
                const mass = this.massDistributionGrid[i][j];
                const [dx, dy] = this.calculateDistortion(mass);
                point.distort(dx, dy);
            }
        }
    }

    calculateDistortion(mass) {
        // Distortion factor based on randomness and amount of mass
        // The greater the mass, the greater the random distortion absolute value
        const distortionFactorRandom = 5 * mass * Math.random() ** 2;

        return [distortionFactorRandom, distortionFactorRandom];
    }

    // not selectable for now
    intersects(x, y) {
        return false;
    }
}
