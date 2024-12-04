import { Ln2 } from "../../math/ln2";
import { Vec2 } from "../../math/vec2";
import { EN_SnapStrategyType, T_GeoSnapResult, T_SnapResult } from "../../type_define/type_define";
import { PLGeoSnap } from "../geo_snap/pl_geo_snap";
import { SnapStrategy } from "./snap_strategy";

/**
 * 多点吸水平竖直线
 */
export class PPSLSSnapStrategy extends SnapStrategy {

    /**吸附主体*/
    private _mPoints: Vec2[] = [];

    /**水平线*/
    private _hLines: Ln2[] = [];

    /**竖直线*/
    private _vLines: Ln2[] = [];

    constructor(mPoints: Vec2[], hLines: Ln2[], vLines: Ln2[]) {
        super();
        this._mPoints = mPoints;
        this._hLines = hLines;
        this._vLines = vLines;
    }

    public getType(): EN_SnapStrategyType {
        return EN_SnapStrategyType.PSLS;
    }

    /**
     * 执行吸附
     * 先用竖直线计算x向吸附距离
     * 再用水平线计算y向吸附距离
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
    public updateClientGeos(): void {
        throw new Error("Method not implemented.");
    }
}
