import p5 from "p5";
import { toRadians, Point, BoundingBox, approxEqual } from "./util";

export enum StartingDirection {
	EAST       = toRadians(0),
	NORTH_EAST = toRadians(60),
	NORTH_WEST = toRadians(120),
	WEST       = toRadians(180),
	SOUTH_WEST = toRadians(240),
	SOUTH_EAST = toRadians(300)
}

export enum AngleDirection {
	W = toRadians(0),
	Q = toRadians(60),
	A = toRadians(120),
	S = toRadians(180),
	D = toRadians(240),
	E = toRadians(300),
}

export default class HexPattern {
    direction: StartingDirection;
    angles: AngleDirection[];
    
    points: Point[] = [];
    uniquePoints: Point[] = [];
    center: Point = [0, 0];
    boundingBox: BoundingBox;

    width: number;
    height: number;

    constructor(direction: StartingDirection, angles: AngleDirection[], initialize: boolean) {
        this.direction = direction;
        this.angles = angles;

        if(initialize) {
            this.calculatePoints();
            this.calculateUniquePoints();
            this.calculateCenter();
            this.calculateBoundingBox();
        }
    }

    static fromString(patternString: string, initialize: boolean): HexPattern {
		const data: string[] = patternString.substring(1, patternString.length - 1).split(' ').map(s => s.trim());
		const directionString: string = data[0].toUpperCase();
		const anglesString: string = data[1].toUpperCase();
		
		const direction: StartingDirection = StartingDirection[directionString as keyof typeof StartingDirection];
		const angles: AngleDirection[] = anglesString
			.split('')
			.map(s => AngleDirection[s as keyof typeof AngleDirection]);
		
		return new HexPattern(direction, angles, initialize);
	}

    calculatePoints(): void {
        let currentAngle = -this.direction;
        let lX = Math.cos(currentAngle);
        let lY = Math.sin(currentAngle);
        this.points.push([0, 0], [lX, lY]);

        for(let i = 0; i < this.angles.length; i++) {
            const angle = -this.angles[i];
            currentAngle += angle;

            const x = lX + Math.cos(currentAngle);
            const y = lY + Math.sin(currentAngle);

            this.points.push([x, y]);

            lX = x;
            lY = y;
        }
    }

    calculateUniquePoints(): void {
        const existingPoints: Point[] = [];

        for(let i = 0; i < this.points.length; i++) {
            const point = this.points[i];

            const exists = existingPoints.find(v =>
                approxEqual(point[0], v[0], 0.001) &&
                approxEqual(point[1], v[1], 0.001)
            );

            if(!exists) {
                existingPoints.push(point);
            }
        }

        this.uniquePoints = existingPoints;
    }

    calculateCenter(): void {
        let sX = 0;
        let sY = 0;
        
        for(let i = 0; i < this.uniquePoints.length; i++) {
            const point = this.uniquePoints[i];
            sX += point[0];
            sY += point[1];
        }

        this.center = [sX / this.uniquePoints.length, sY / this.uniquePoints.length];
    }

    calculateBoundingBox(): void {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for(let i = 0; i < this.uniquePoints.length; i++) {
            const point = this.uniquePoints[i];

            if(point[0] < minX) minX = point[0];
            if(point[0] > maxX) maxX = point[0];
            if(point[1] < minY) minY = point[1];
            if(point[1] > maxY) maxY = point[1];
        }

        this.boundingBox = {
            min: [minX, minY],
            max: [maxX, maxY]
        };
        
        this.width = maxX - minX;
        this.height = maxY - minY;
    }

    debugRender(p5: p5): void {
        p5.translate(-this.center[0], -this.center[1]);

        // Bounding box
        p5.noStroke();
        p5.fill(255);
        p5.rect(this.boundingBox.min[0], this.boundingBox.min[1], this.width, this.height);

        // Center
        p5.stroke(255, 0, 0);
        p5.point(this.center[0], this.center[1]);

        // Points
        p5.stroke(0);
        for(let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            
            p5.point(point[0], point[1]);
        }
    }
}