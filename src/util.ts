export type Point = [number, number];

export type BoundingBox = {
    min: Point,
    max: Point
};

export type WigglyLineOptions = {
    intensity?: number,
    segments?: number,
    speed?: number,
    frequency?: number,
    noiseOffset?: number,
    directionIndicator?: boolean
};

export function toRadians(degrees: number): number {
	return degrees * Math.PI / 180;
}

export function approxEqual(a: number, b: number, tolerance: number) {
    return Math.abs(a - b) < tolerance;
}