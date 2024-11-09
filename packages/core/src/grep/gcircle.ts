import { EN_RenderShapeType } from "../type_define/type_define";
import { GShape, T_ShapeGeoAttrs, T_ShapeStyle } from "./gshape";


export type T_CircleStyle = T_ShapeStyle & {}

export type T_CircleGeoAttrs = T_ShapeGeoAttrs & {}

/**
 * 圆
 */
export class GCircle extends GShape<T_CircleGeoAttrs, T_CircleStyle> {
    public getShapeType(): EN_RenderShapeType {
        return EN_RenderShapeType.CIRCLE;
    }
}