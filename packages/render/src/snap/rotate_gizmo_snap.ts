import { MathUtil, PLsSnap, SnapBase, T_SnapResult, Vec2 } from "@gene/core";

/**
 * 旋转控件吸附
 */
export class RotateGizmoSnap extends SnapBase {

    /**吸附点*/
    private _mPoint: Vec2;

    /**旋转物体中心点*/
    private _center: Vec2;

    constructor(mPoint: Vec2, center: Vec2) {
        super();
        this._mPoint = mPoint;
        this._center = center;
    }
    /**
     * 主要吸附客体生成的45度间隔角度线
     */
    public doSnap(): T_SnapResult {
        const lines = MathUtil.getLinesRotate45(this._center);
        const plSnap = new PLsSnap(this._mPoint, lines);
        const result = plSnap.doSnap();
        return result;
    }
}