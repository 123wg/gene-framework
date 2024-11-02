import { T_LineAttrs, T_LineStyle, T_XY } from "../type_define/type_define";
import { GShape } from "./gshape";

export class GLine extends GShape<T_LineAttrs, T_LineStyle> {
    private _start: T_XY;

    private _end: T_XY;
    constructor(start: T_XY, end: T_XY) {
        super();
        this._start = start;
        this._end = end;
    }
    protected _toRenderAttrsWithoutStyle(): T_LineAttrs {
        return {
            points: [this._start.x, this._start.y, this._end.x, this._end.y]
        };
    }
}