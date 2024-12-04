import { Vec2 } from "../../math/vec2";
import { EN_SnapStrategyType, T_GeoSnapResult, T_SnapResult } from "../../type_define/type_define";
import { PPGeoSnap } from "../geo_snap/pp_geo_snap";
import { SnapStrategy } from "./snap_strategy";

/**
 * 单点吸多点
 */
export class PPSSnapStrategy extends SnapStrategy {
    private _mPoint: Vec2;

    private _cPoints: Array<Vec2>;
    constructor(mPoint: Vec2) {
        super();
        this._mPoint = mPoint;
    }

    public getType(): EN_SnapStrategyType {
        return EN_SnapStrategyType.PPS;
    }

    public updateClientGeos() {
        this._cPoints = this.geoHelper.getAllElementsRectPoints();
    }

    public doSnap() {
        const geoResult: T_GeoSnapResult<Vec2>[] = [];
        this._cPoints.forEach(p => {
            const gSnap = new PPGeoSnap(this._mPoint, p);
            const result = gSnap.execute();
            if (result) geoResult.push(result);
        });

        const defResult = this.getPointNotSnappedResult(this._mPoint);
        if (!geoResult.length) return defResult;

        geoResult.sort((a, b) => a.distance - b.distance);
        const oneGeo = geoResult[0];
        const { dx, dy, snapPos } = oneGeo;
        const snapResult: T_SnapResult = {
            dx, dy, snapPos, snapped: true
        };
        return snapResult;
    }
}