import { T_Constructor } from "../type_define/type_guard";
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

    public static setClientGeoHelper(helper: I_SnapGeoHelper) {
        this._clientGeoHelper = helper;
    }

    public static doSnap<T extends T_Constructor<SnapStrategy>>(snapStrategy: T, ...params: ConstructorParameters<T>) {
        const strategy = new snapStrategy(...params);
        strategy.geoHelper = SnapEnginee._clientGeoHelper;
        return strategy.doSnap();
    }
}