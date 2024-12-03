import { Vec2 } from "../../math/vec2";
import { SnapStrategy } from "./snap_strategy";

/**
 * 单点吸多点
 * 参数为鼠标点
 */
export class PPSSnapStrategy extends SnapStrategy {
    private _mPoint: Vec2;

    private _cPoints: Vec2;
    constructor(mPoint: Vec2) {
        super();
        this._mPoint = mPoint;
    }
    // public doSnap() {
    //     const cPoints =
    //     // throw new Error("Method not implemented.");
    // }
}