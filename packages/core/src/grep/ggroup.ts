import { T_NodeAttrs } from "../type_define/type_define";
import { GNode } from "./gnode";

export class GGroup extends GNode {
    private _children: GNode[] = [];
    protected _toRenderAttrsWithoutStyle(): T_NodeAttrs {
        throw new Error("Method not implemented.");
    }

}