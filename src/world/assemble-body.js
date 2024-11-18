import { Body } from "./form.js";

export function assembleBody() {
    const body = new Body(600, 200);
    body.addSegment(500, 200, 100, -45).addSegment(500, 250, 300, 90);
    body.segments[0]
        .addPiece(0, 0, 50, 50)
        .addPiece(50, 0, 50, 50)
        .addPiece(120, -30, 120, 70);
    body.segments[1].addPiece(0, 75, 200, 50).addPiece(50, 30, 120, 90);
    return body;
}
