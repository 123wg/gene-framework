import { T_ShapeAttrs, T_ShapeStyle } from "../type_define/type_define";
import { GNode } from "./gnode";

export abstract class GShape
    <T extends T_ShapeAttrs, K extends T_ShapeStyle>
    extends GNode<T, K> {

}