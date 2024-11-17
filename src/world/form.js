import { Screen } from "../screen/screen.js";
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
        thetaRad = (Math.PI * theta) / 360;

        const xAlongSegment = distanceAlongSegment * Math.cos(thetaRad);
        const xPerpendicular = distancePerpendicular * Math.cos(thetaRad);
        const xPiece = this.x + xAlongSegment + xPerpendicular;

        const yAlongSegment = distanceAlongSegment * Math.sin(thetaRad);
        const yPerpendicular = distancePerpendicular * Math.sin(thetaRad);
        const yPiece = this.y + yAlongSegment + yPerpendicular;

        const piece = new Piece(xPiece, yPiece, width, height);
        this.pieces.push(piece);

        return this;
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
        const xpc = this.xc - xp;
        const distortionFactorX = 1 - Math.abs(xpc / (this.width / 2));
        const dx = xpc * distortionFactorX;

        const ypc = this.yc - yp;
        const distortionFactorY = 1 - Math.abs(ypc / (this.height / 2));
        const dy = ypc * distortionFactorY;

        return [dx, dy];
    }
}
