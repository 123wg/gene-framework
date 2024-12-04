import { Vec2 } from "../../math/vec2";
import { EN_SnapStrategyType, T_SnapResult } from "../../type_define/type_define";
import { I_SnapGeoHelper } from "../i_snap_geo_helper";

/**
 * 吸附策略
 */
export abstract class SnapStrategy {

    /**计算吸附目标的辅助工具*/
    public geoHelper: I_SnapGeoHelper;

    public abstract getType(): EN_SnapStrategyType

    /**执行吸附*/
    public abstract doSnap(): T_SnapResult

    /**更新吸附目标*/
    public abstract updateClientGeos(): void

    /**
     * 点未获取到吸附结果返回
     */
    public getPointNotSnappedResult(pos: Vec2): T_SnapResult {
        return {
            snapPos: pos,
            dx: 0,
            dy: 0,
            snapped: false
        };
    }
}