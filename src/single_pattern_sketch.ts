import P5 from "p5";
import HexPattern from "./hex_pattern";
import { Point, WigglyLineOptions } from "./util";
import HexPatternMarkdown from "./main";
import { HexPatternMarkdownSettings } from "./settings";

export default class SinglePatternSketch extends P5 {
    canvas: P5.Renderer;
    pattern: HexPattern;
    plugin: HexPatternMarkdown;
    settings: HexPatternMarkdownSettings;

    constructor(pattern: HexPattern, element: HTMLElement, plugin: HexPatternMarkdown) {
        super(() => {}, element);
        this.pattern = pattern;
        this.plugin = plugin;
        this.settings = plugin.settings;
    }

    setup(): void {
        this.canvas = this.createCanvas(0, 0);
        this.canvas.elt.style.visibility = "visible";
    }

    draw(): void {
        if(this.settings.patternSize != this.width || this.settings.patternSize != this.height) {
            this.resizeCanvas(this.settings.patternSize, this.settings.patternSize);
        }

        const startColor = this.color(this.settings.patternColorStart);
        const endColor = this.color(this.settings.patternColorEnd);

        const patternScaleModifier = 0.9;
        let patternScale = 1;
        if(this.pattern.height > this.pattern.width) {
            patternScale = this.height / this.pattern.height;
        } else {
            patternScale = this.width / this.pattern.width;
        }

        this.clear();
        this.translate(this.width / 2, this.height / 2);
        this.scale(patternScale * patternScaleModifier);
        this.translate(-this.pattern.boundingBoxCenter[0], -this.pattern.boundingBoxCenter[1]);
        this.strokeWeight(0.1);

        const points = this.pattern.points;

        let lastPoint: Point = points[0];
        for(let i = 1; i < points.length; i++) {
            const point = points[i];

            this.stroke(this.lerpColor(startColor, endColor, i / points.length));

            if(this.settings.animatePattern) {
                this.wigglyLine(lastPoint[0], lastPoint[1], point[0], point[1],
                    this.millis(), { noiseOffset: i, directionIndicator: this.settings.directionIndicator });
            } else {
                this.line(lastPoint[0], lastPoint[1], point[0], point[1]);
                if(this.settings.directionIndicator) {
                    this.directionIndicator(lastPoint[0], lastPoint[1], point[0], point[1], 0.05);
                }
            }

            lastPoint = point;
        }

    }

    wigglyLine(x1: number, y1: number, x2: number, y2: number, time: number, options: WigglyLineOptions = {}): void {
        const intensity = options.intensity ?? 0.1;
        const segments = options.segments ?? 10;
        const speed = options.speed ?? 0.01;
        const frequency = options.frequency ?? 2;
        const noiseOffset = options.noiseOffset ?? 0;
        const directionIndicator = options.directionIndicator ?? false;

        const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI * 0.5;

        const n = this.noise;
        function getNoise(t: number, amplitude: number): Point {
            const off = (n((time * speed), t * frequency, noiseOffset) * 2 - 1) * intensity;
            const x = Math.cos(angle) * off * amplitude;
            const y = Math.sin(angle) * off * amplitude;
            return [x, y];
        }

        let lX = x1;
        let lY = y1;
        for(let i = 1; i < segments; i++) {
            const t = i / segments;
            const endDist = 1 - Math.abs(0.5 - t);
            const offset = getNoise(t, endDist);

            const x = this.lerp(x1, x2, t) + offset[0];
            const y = this.lerp(y1, y2, t) + offset[1];

            this.line(lX, lY, x, y);

            lX = x;
            lY = y;
        }

        this.line(lX, lY, x2, y2);

        if(directionIndicator) {
            const offset = getNoise(0.5, 1);
            this.directionIndicator(x1 + offset[0], y1 + offset[1], x2 + offset[0], y2 + offset[1], 0.05);
        }
    }

    directionIndicator(x1: number, y1: number, x2: number, y2: number, size: number) {
        const direction = -Math.atan2(y2 - y1, x2 - x1);
        const x = (x1 + x2) / 2;
        const y = (y1 + y2) / 2;

        this.beginShape();
        for(let i = 0; i < 3; i++) {
            const angle = (i / 3) * this.TAU;
            const vX = Math.cos(angle + direction) * size;
            const vY = Math.sin(angle + direction) * size;
            this.vertex(vX + x, vY + y);
        }
        this.endShape(this.CLOSE);
    }
}