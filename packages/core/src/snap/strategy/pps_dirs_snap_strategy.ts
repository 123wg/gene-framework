import { Ln2 } from "../../math/ln2";
import { Vec2 } from "../../math/vec2";
import { EN_SnapStrategyType, T_GeoSnapResult, T_SnapResult } from "../../type_define/type_define";
import { PLGeoSnap } from "../geo_snap/pl_geo_snap";
import { SnapEnginee } from "../snap_enginee";
import { PPSSnapStrategy } from "./pps_snap_strategy";
import { SnapStrategy } from "./snap_strategy";

/**
 * 单点吸上一点方向和吸多点
 */
export class PPSDirsSnapStrategy extends SnapStrategy {
    /**当前点*/
    private _mPoint: Vec2;

    /**前一个点*/
    private _previous: Vec2 | undefined;

    /**可吸附线*/
    private _cLines: Ln2[] = [];

    constructor(mPoint: Vec2, previous?: Vec2) {
        super();
        this._mPoint = mPoint;
        this._previous = previous;
    }

    public setPrevious(previous: Vec2) {
        this._previous = previous;
    }

    public getType(): EN_SnapStrategyType {
        return EN_SnapStrategyType.PPSDIRS;
    }

    public doSnap(): T_SnapResult {
        const ppResult = SnapEnginee.doSnap(PPSSnapStrategy, this._mPoint);
        if (!this._previous) return ppResult;

        this.updateClientGeos();

        // 计算点线吸附,有返回,没有返回点吸附
        const plGeoResult: T_GeoSnapResult<Ln2>[] = [];
        this._cLines.forEach(ln => {
            const plSnap = new PLGeoSnap(this._mPoint, ln);
            const plGeo = plSnap.execute();
            if (plGeo) plGeoResult.push(plGeo);
        });

        if (!plGeoResult.length) return ppResult;
        plGeoResult.sort((a, b) => a.distance - b.distance);
        const { dx, dy, snapPos } = plGeoResult[0];
        const result: T_SnapResult = {
            dx, dy, snapPos, snapped: true
        };
        return result;
    }

    public updateClientGeos(): void {
        if (!this._previous) return;
        const dir = Vec2.X();
        const lines: Ln2[] = [];
        for (let i = 0; i < 4; i += 1) {
            const newDir = dir.vecRotate(Math.PI / 4 * i);
            const end = this._previous.added(newDir);
            const ln = new Ln2(this._previous, end);
            lines.push(ln);
        }
        this._cLines = lines;
    }
}