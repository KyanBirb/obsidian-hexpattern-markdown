import P5 from "p5";
import HexPattern from "./hex_pattern";

export default class SinglePatternSketch extends P5 {
    canvas: P5.Renderer;
    pattern: HexPattern;

    constructor(pattern: HexPattern, element: HTMLElement) {
        super(() => {}, element);
        this.pattern = pattern;
    }

    setup(): void {
        this.canvas = this.createCanvas(500, 500);
        this.canvas.elt.style.visibility = "visible";
    }

    draw(): void {
        this.translate(this.width / 2, this.height / 2);
        this.scale(50);
        this.strokeWeight(0.1);

        this.pattern.debugRender(this);
    }
}