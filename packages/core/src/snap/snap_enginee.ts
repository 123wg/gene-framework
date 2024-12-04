import { I_SnapGeoHelper } from "./i_snap_geo_helper";
import { SnapStrategy } from "./strategy/snap_strategy";

/**
 * 吸附引擎，执行吸附的入口
 */
export class SnapEnginee {
    /**
     * 根据业务获取可吸附几何数据
     */
    private static _clientGeoHelper: I_SnapGeoHelper;

    /**
     * 吸附策略
     * 暂时先执行单策略，如果需要多个一起执行，需要将所有参数提取到snapContext中统一管理
     */
    private _snapStrategy: SnapStrategy;

    public static setClientGeoHelper(helper: I_SnapGeoHelper) {
        this._clientGeoHelper = helper;
    }

    constructor(snapStrategy: SnapStrategy) {
        this._snapStrategy = snapStrategy;
        this._snapStrategy.geoHelper = SnapEnginee._clientGeoHelper;
    }
}