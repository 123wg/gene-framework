import { EN_RenderShapeType, T_Rect } from "../type_define/type_define";
import { GShape, T_ShapeGeoAttrs, T_ShapeStyle } from "./gshape";

export type T_ImageStyle = T_ShapeStyle & {}
export type T_ImageGeoAttrs = T_ShapeGeoAttrs & {
    image: CanvasImageSource | undefined
    crop?: T_Rect
    cornerRadius?: number | number[]
}

export class GImage extends GShape<T_ImageGeoAttrs, T_ImageStyle> {
    public getShapeType(): EN_RenderShapeType {
        return EN_RenderShapeType.IMAGE;
    }
}   