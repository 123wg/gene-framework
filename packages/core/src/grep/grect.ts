import { EN_RenderShapeType } from "../type_define/type_define";
import { GShape, T_ShapeGeoAttrs, T_ShapeStyle } from "./gshape";

export type T_RectStyle = T_ShapeStyle & {}

export type T_RectGeoAttrs = T_ShapeGeoAttrs & {
    cornerRadius?: number | number[]
}

export class GRect<T extends T_RectGeoAttrs = T_RectGeoAttrs, K extends T_RectStyle = T_RectStyle> extends GShape<T, K> {
    public getShapeType(): EN_RenderShapeType {
        return EN_RenderShapeType.RECT;
    }
}