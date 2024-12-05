import { Ln2 } from "../math/ln2";
import { Vec2 } from "../math/vec2";
import { T_GeoSnapResult, T_SnapResult } from "../type_define/type_define";
import { PLGeoSnap } from "./geo_snap/pl_geo_snap";
import { SnapBase } from "./snap_base";

/**
 * 点和水平竖直线吸附
 */
export class PsHVLsSnap extends SnapBase {
    private _mPoints: Vec2[] = [];

    private _hLines: Ln2[] = [];

    private _vLines: Ln2[] = [];
    constructor(mPoint: Vec2[], hLines: Ln2[], vLines: Ln2[]) {
        super();
        this._mPoints = mPoint;
        this._hLines = hLines;
        this._vLines = vLines;
    }

    /**
     * 先吸竖直线算dx,在吸水平线算dy
     * 返回的snapPos是随机找的一个点,应该主要关注dx和dy
     */
    public doSnap(): T_SnapResult {
        const xGeoSnaps: T_GeoSnapResult<Ln2>[] = [];
        const yGeoSnaps: T_GeoSnapResult<Ln2>[] = [];
        this._mPoints.forEach(p => {
            this._vLines.forEach(line => {
                const geoSnap = new PLGeoSnap(p, line);
                const result = geoSnap.execute();
                if (result) xGeoSnaps.push(result);
            });
            this._hLines.forEach(line => {
                const geoSnap = new PLGeoSnap(p, line);
                const result = geoSnap.execute();
                if (result) yGeoSnaps.push(result);
            });
        });
        xGeoSnaps.sort((a, b) => a.distance - b.distance);
        yGeoSnaps.sort((a, b) => a.distance - b.distance);
        const result: T_SnapResult = {
            snapPos: this._mPoints[0],
            dx: 0,
            dy: 0,
            snapped: false
        };
        if (xGeoSnaps.length) {
            result.dx = xGeoSnaps[0].dx;
            result.snapped = true;
        }
        if (yGeoSnaps.length) {
            result.dy = yGeoSnaps[0].dy;
            result.snapped = true;
        }
        return result;
    }
}