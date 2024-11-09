import { EN_RenderShapeType } from "../type_define/type_define";
import { GShape, T_ShapeGeoAttrs, T_ShapeStyle } from "./gshape";

export type T_LineStyle = T_ShapeStyle & {}

export type T_LineGeoAttrs = T_ShapeGeoAttrs & {
    points: number[]
}

export class GLine<T extends T_LineGeoAttrs = T_LineGeoAttrs, K extends T_LineStyle = T_LineStyle> extends GShape<T, K> {
    public getShapeType(): EN_RenderShapeType {
        return EN_RenderShapeType.LINE;
    }
}