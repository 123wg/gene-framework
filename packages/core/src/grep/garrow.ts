import { EN_RenderShapeType } from "../type_define/type_define";
import { GLine, T_LineGeoAttrs, T_LineStyle } from "./gline";

export type T_ArrowStyle = T_LineStyle & {
    tension?: number;
    closed?: boolean;
    pointerLength?: number;
    pointerWidth?: number;
    pointerAtBeginning?: boolean;
    pointerAtEnding?: boolean;
}
export type T_ArrowGeoAttrs = T_LineGeoAttrs & {}

/**
 * 箭头
 */
export class GArrow extends GLine<T_ArrowGeoAttrs, T_ArrowStyle> {
    public getShapeType(): EN_RenderShapeType {
        return EN_RenderShapeType.ARROW;
    }
}