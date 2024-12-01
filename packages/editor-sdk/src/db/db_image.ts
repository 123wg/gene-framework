import { CoreConfig, DBTransform, I_DBTransformProps } from "@gene/core";

export interface I_DBImageProps extends I_DBTransformProps {
    src: string
}

export class DBImage extends DBTransform<I_DBImageProps> implements I_DBImageProps {
    public src = '';

    public width: number = CoreConfig.previewImgWidth;

    public height: number = 100;
}