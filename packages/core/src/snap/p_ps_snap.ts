import { Vec2 } from "../math/vec2";
import { T_GeoSnapResult, T_SnapResult } from "../type_define/type_define";
import { PPGeoSnap } from "./geo_snap/pp_geo_snap";
import { SnapBase } from "./snap_base";

/**
 * 点和多点吸附
 */
export class PPsSnap extends SnapBase {
    private _mPoint: Vec2;

    private _cPoints: Vec2[];
    constructor(mPoint: Vec2, cPoints: Vec2[]) {
        super();
        this._mPoint = mPoint;
        this._cPoints = cPoints;
    }

    public doSnap(): T_SnapResult {
        const geoResult: T_GeoSnapResult<Vec2>[] = [];
        this._cPoints.forEach(p => {
            const gSnap = new PPGeoSnap(this._mPoint, p);
            const result = gSnap.execute();
            if (result) geoResult.push(result);
        });

        if (!geoResult.length) {
            const result: T_SnapResult = {
                snapPos: this._mPoint,
                dx: 0,
                dy: 0,
                snapped: false,
                previewNodes: []
            };
            return result;
        }

        geoResult.sort((a, b) => a.distance - b.distance);
        const oneGeo = geoResult[0];
        const { dx, dy, snapPos, previewNodes } = oneGeo;
        const snapResult: T_SnapResult = {
            dx, dy, snapPos, snapped: true, previewNodes
        };
        return snapResult;
    }
}