import { Vec2 } from "../../math/vec2";
import { EN_GeoSnapType, T_GeoSnapResult } from "../../type_define/type_define";
import { GeoSnap } from "./geo_snap";

/**
 * 点点几何吸附
 */
export class PPGeoSnap extends GeoSnap<Vec2> {

    /**吸附主体*/
    private _mPoint: Vec2;

    /**吸附客体*/
    private _cPoint: Vec2;

    constructor(mPoint: Vec2, cPoint: Vec2) {
        super();
        this._mPoint = mPoint;
        this._cPoint = cPoint;
    }

    public getType(): EN_GeoSnapType {
        return EN_GeoSnapType.POINT_POINT;
    }
    public execute(): T_GeoSnapResult<Vec2> {
        const distance = this._mPoint.distanceTo(this._cPoint);
        let geo: Vec2 | undefined = undefined;
        if (distance < this._snapSetting.ppDistance) {
            geo = this._cPoint;
        }
        return {
            type: this.getType(),
            geo
        };
    }
}