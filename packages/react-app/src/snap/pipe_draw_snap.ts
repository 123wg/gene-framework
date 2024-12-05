import { Vec2 } from "@gene/core";
import { SnapBase } from "@gene/core/src/snap/snap_base";
import { T_SnapResult } from "@gene/core/src/type_define/type_define";

/**
 * 管道绘制吸附
 * 吸所有点和上一个点固定角度组成的线
 */
export class PipeDrawSnap extends SnapBase {
    private _mPoint: Vec2;

    private _previous: Vec2 | undefined;
    constructor(mPoint: Vec2, previous?: Vec2) {
        super();
        this._mPoint = mPoint;
        this._previous = previous;
    }

    public doSnap(): T_SnapResult {

    }
}