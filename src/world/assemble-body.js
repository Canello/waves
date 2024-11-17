import { Body, Segment } from "./form.js";

export function assembleBody() {
    const head = new Segment(500, 200, 100, -45);
    head.addPiece(0, 0, 50, 50)
        .addPiece(50, 0, 50, 50)
        .addPiece(120, -30, 120, 70);

    const torso = new Segment(500, 250, 300, 90);
    torso.addPiece(0, 75, 200, 50).addPiece(50, 30, 120, 90);

    const body = new Body();
    body.addSegment(head).addSegment(torso);

    return body;
}
