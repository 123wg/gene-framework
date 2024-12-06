import { Ln2 } from "../math/ln2";
import { Vec2 } from "../math/vec2";
import { T_GeoSnapResult, T_SnapResult } from "../type_define/type_define";
import { PLGeoSnap } from "./geo_snap/pl_geo_snap";
import { SnapBase } from "./snap_base";

/**
 * 点和多线吸附
 */
export class PLsSnap extends SnapBase {
    private _mPoint: Vec2;

    private _cLines: Ln2[] = [];
    constructor(mPoint: Vec2, cLines: Ln2[]) {
        super();
        this._mPoint = mPoint;
        this._cLines = cLines;
    }
    public doSnap(): T_SnapResult {
        const plGeoResult: T_GeoSnapResult<Ln2>[] = [];
        this._cLines.forEach(ln => {
            const plSnap = new PLGeoSnap(this._mPoint, ln);
            const plGeo = plSnap.execute();
            if (plGeo) plGeoResult.push(plGeo);
        });
        if (!plGeoResult.length) {
            const result: T_SnapResult = {
                snapPos: this._mPoint,
                dx: 0,
                dy: 0,
                snapped: false,
                previewNodes: []
            };
            return result;
        }
        plGeoResult.sort((a, b) => a.distance - b.distance);
        const { dx, dy, snapPos, previewNodes } = plGeoResult[0];
        const result: T_SnapResult = {
            dx, dy, snapPos, snapped: true, previewNodes
        };
        return result;
    }
}