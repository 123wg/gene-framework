import { DBElement, I_DBElementProps } from "@gene/core";

export interface I_DBCircleProps extends I_DBElementProps {
    radius: number,
    x: number,
    y: number
}

export class DBCircle extends DBElement<I_DBCircleProps> implements I_DBCircleProps {
    public radius = 5;

    public x = 0;

    public y = 0;
}