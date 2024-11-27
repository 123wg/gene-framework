import { CoreConfig, DBElement, I_DBElementProps } from "@gene/core";

export interface I_DBImageProps extends I_DBElementProps {
    src: string
}

export class DBImage extends DBElement<I_DBImageProps> implements I_DBImageProps {
    public src = '';

    public x: number = 0;

    public y: number = 0;

    public width: number = CoreConfig.previewImgWidth;

    public height: number = 100;
}