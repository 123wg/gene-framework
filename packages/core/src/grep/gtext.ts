import { EN_RenderShapeType } from "../type_define/type_define";
import { GShape, T_ShapeGeoAttrs, T_ShapeStyle } from "./gshape";

export type T_TextStyle = T_ShapeStyle & {
    direction?: string;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: string;
    fontVariant?: string;
    textDecoration?: string;
    align?: string;
    verticalAlign?: string;
    padding?: number;
    lineHeight?: number;
    letterSpacing?: number;
    wrap?: string;
    ellipsis?: boolean;
}

export type T_TextGeoAttrs = T_ShapeGeoAttrs & {
    text: string
}


/**
 * 文字
 */
export class GText extends GShape<T_TextGeoAttrs, T_TextStyle> {
    public getShapeType(): EN_RenderShapeType {
        return EN_RenderShapeType.TEXT;
    }
}