import { DBTransform, I_DBTransformProps } from "@gene/core";

export interface I_DBPolygonProps extends I_DBTransformProps {
    sides: number
    radius: number
}

export class DBPolygon extends DBTransform<I_DBPolygonProps> implements I_DBPolygonProps {
    public sides = 6;

    public radius = 10;
}