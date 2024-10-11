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
        this.translate(-this.pattern.center[0], -this.pattern.center[1]);
        this.strokeWeight(0.1);

        const points = this.pattern.points;

        let lastPoint: Point = points[0];
        for(let i = 1; i < points.length; i++) {
            const point = points[i];

            this.stroke(this.lerpColor(startColor, endColor, i / points.length));

            if(this.settings.animatePattern) {
                this.wigglyLine(lastPoint[0], lastPoint[1], point[0], point[1],
                    this.millis(), { noiseOffset: i });
            } else {
                this.line(lastPoint[0], lastPoint[1], point[0], point[1]);
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

        const angle = Math.atan2(y2 - y1, x2 - x1) + Math.PI * 0.5;

        let lX = x1;
        let lY = y1;

        for(let i = 1; i < segments; i++) {
            const t = i / segments;
            const endDist = 1 - Math.abs(0.5 - t);

            const offset = (this.noise((time * speed), t * frequency, noiseOffset) * 2 - 1) * intensity;
            const offX = Math.cos(angle) * offset * endDist;
            const offY = Math.sin(angle) * offset * endDist;

            const x = this.lerp(x1, x2, t) + offX;
            const y = this.lerp(y1, y2, t) + offY;

            this.line(lX, lY, x, y);

            lX = x;
            lY = y;
        }

        this.line(lX, lY, x2, y2);
    }
}