import { EN_LineCap, EN_LineJoin } from "../type_define/type_define";
import { GNode, T_NodeGeoAttrs, T_NodeStyle } from "./gnode";

export type T_ShapeStyle = T_NodeStyle & {
    fill?: string | CanvasGradient;
    stroke?: string | CanvasGradient;
    strokeWidth?: number;
    lineJoin?: EN_LineJoin;
    lineCap?: EN_LineCap;
    dash?: number[];
    dashOffset?: number;
    strokeScaleEnabled?: boolean
}

export type T_ShapeGeoAttrs = T_NodeGeoAttrs & {}


export abstract class GShape
    <T extends T_ShapeGeoAttrs = T_ShapeGeoAttrs, K extends T_ShapeStyle = T_ShapeStyle>
    extends GNode<T, K> {

    protected _style = {
        strokeScaleEnabled: false
    } as K;

}