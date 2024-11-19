import { EN_RenderShapeType } from "../type_define/type_define";
import { GShape, T_ShapeGeoAttrs, T_ShapeStyle } from "./gshape";

export type T_RegPolygonStyle = T_ShapeStyle & {}

export type T_RegPolygonGeoAttrs = T_ShapeGeoAttrs & {
    sides: number
    radius: number
}

/**
 * 正多边形
 */
export class GRegPolygon extends GShape<T_RegPolygonGeoAttrs, T_RegPolygonStyle> {
    public getShapeType(): EN_RenderShapeType {
        return EN_RenderShapeType.REG_POLYGON;
    }
}