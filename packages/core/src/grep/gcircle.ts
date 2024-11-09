import { EN_RenderShapeType, T_CircleAttrs, T_ShapeStyle } from "../type_define/type_define";
import { GShape } from "./gshape";

/**
 * 圆
 */
export class GCircle extends GShape<T_CircleAttrs, T_ShapeStyle> {
    private _radius: number;
    constructor(radius: number) {
        super();
        this._radius = radius;
    }
    public getShapeType(): EN_RenderShapeType {
        return EN_RenderShapeType.CIRCLE;
    }
    protected _toRenderAttrsWithoutStyle(): T_CircleAttrs {
        return {
            radius: this._radius
        };
    }

}