import { DBElement, I_DBElementProps } from "@gene/core";

export interface I_DBPolygonProps extends I_DBElementProps {
    sides: number
    radius: number
    x: number,
    y: number
}

export class DBPolygon extends DBElement<I_DBPolygonProps> implements I_DBPolygonProps {
    public sides = 6;

    public radius = 10;

    public x = 0;

    public y = 0;
}