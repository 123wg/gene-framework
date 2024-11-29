import { DBElement, I_DBElementProps } from "@gene/core";

export interface I_DBTransformProps extends I_DBElementProps {
    x: number,
    y: number,
    rotation: number
    scaleX: number
    scaleY: number
}

export class DBTransform<T extends I_DBTransformProps = I_DBTransformProps> extends DBElement<T> implements I_DBTransformProps {
    public x = 0;

    public y = 0;

    public rotation = 0;

    public scaleX = 1;

    public scaleY = 1;
}