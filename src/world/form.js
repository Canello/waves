import { Background } from "./background.js";

export class Body {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.segments = [];
    }

    addSegment(segment) {
        this.segments.push(segment);
        return this;
    }

    distort() {
        this.segments.forEach((segment) =>
            segment.pieces.forEach((piece) => piece.distort())
        );
    }
}

export class Segment {
    constructor(x, y, length, theta) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.theta = theta;
        this.pieces = [];
    }

    addPiece(distanceAlongSegment, distancePerpendicular, width, height) {
        const thetaRad = (Math.PI * this.theta) / 180;

        const xAlongSegment = distanceAlongSegment * Math.cos(thetaRad);
        const xPerpendicular =
            distancePerpendicular * Math.cos(thetaRad + Math.PI / 2);
        const xPiece = this.x + xAlongSegment + xPerpendicular;

        const yAlongSegment = distanceAlongSegment * Math.sin(thetaRad);
        const yPerpendicular =
            distancePerpendicular * Math.sin(thetaRad + Math.PI / 2);
        const yPiece = this.y + yAlongSegment + yPerpendicular;

        const piece = new Piece(xPiece, yPiece, width, height);
        this.pieces.push(piece);

        return this;
    }

    distort() {
        this.pieces.forEach((piece) => piece.distort());
    }
}

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
        // Distortion factor based on euclidean distance of point to center of piece
        // The CLOSER to the center, the greater the distortion towards the center
        const pc = Math.sqrt((this.xc - xp) ** 2 + (this.yc - yp) ** 2);
        const pcMax = Math.sqrt(
            (this.xc - this.x) ** 2 + (this.yc - this.y) ** 2
        );
        const distortionFactorEuclidean = 1 - pc / pcMax;

        // Distortion factors based on x and y distances of point to center of piece
        // The FURTHER from the center, the greater the distortion towards the center
        const xpc = this.xc - xp;
        const distortionFactorX = Math.abs(xpc / (this.width / 2));
        const ypc = this.yc - yp;
        const distortionFactorY = Math.abs(ypc / (this.height / 2));

        // Distortion factor based on randomness and euclidean distance of point to center of piece
        // The CLOSER to the center, the greater the random distortion absolute value
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
}
