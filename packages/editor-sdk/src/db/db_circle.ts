import { DBTransform, I_DBTransformProps } from "@gene/core";

export interface I_DBCircleProps extends I_DBTransformProps {
    radius: number,
}

export class DBCircle extends DBTransform<I_DBCircleProps> implements I_DBCircleProps {
    public radius = 5;
}