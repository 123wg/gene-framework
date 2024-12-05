import { PLsSnap, PPsSnap, SnapBase, T_SnapResult, Vec2 } from "@gene/core";
import { SnapGeoHelper } from "./snap_geo_helper";

/**
 * 管道绘制吸附
 */
export class PipeDrawSnap extends SnapBase {
    private _mPoint: Vec2;

    private _previous: Vec2 | undefined;
    constructor(mPoint: Vec2, previous?: Vec2) {
        super();
        this._mPoint = mPoint;
        this._previous = previous;
    }

    /**
     * 可吸其它管道端点 和变换图元角点
     */
    public doSnap(): T_SnapResult {
        const snapPoints = SnapGeoHelper.getPipeDrawSnapPoints();
        const snap = new PPsSnap(this._mPoint, snapPoints);
        const ppsSnapResult = snap.doSnap();

        if (!this._previous) return ppsSnapResult;

        const snapLines = SnapGeoHelper.getLinesRotate45(this._previous);
        const plsSnap = new PLsSnap(this._mPoint, snapLines);
        const plsSnapResult = plsSnap.doSnap();

        if (!plsSnapResult.snapped) return ppsSnapResult;
        else return plsSnapResult;
    }
}