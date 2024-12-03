import { Ln2 } from "../../math/ln2";
import { Vec2 } from "../../math/vec2";
import { EN_GeoSnapType, T_GeoSnapResult } from "../../type_define/type_define";
import { GeoSnap } from "./geo_snap";

/**
 * 点线几何吸附
 */
export class PLGeoSnap extends GeoSnap<Ln2> {
    private _mPoint: Vec2;

    private _cLine: Ln2;
    constructor(mPoint: Vec2, cLine: Ln2) {
        super();
        this._mPoint = mPoint;
        this._cLine = cLine;
    }
    public getType(): EN_GeoSnapType {
        return EN_GeoSnapType.POINT_LINE;
    }
    public execute(): T_GeoSnapResult<Ln2> {
        const footer = this._cLine.getProjectedPtBy(this._mPoint);
        const distance = this._mPoint.distanceTo(footer);
        let geo = undefined;
        if (distance < this._snapSetting.plDistance) {
            geo = this._cLine;
        }
        return {
            type: this.getType(),
            geo
        };
    }
}