import { DBTransform, I_DBTransformProps } from "@gene/core";

export interface I_DBRectProps extends I_DBTransformProps {
    width: number,
    height: number
}

export class DBRect extends DBTransform<I_DBRectProps> implements I_DBRectProps {
    public width = 1;

    public height = 1;
}