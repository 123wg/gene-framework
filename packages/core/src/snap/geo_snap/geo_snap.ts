import { EN_GeoSnapType, T_GeoSnapResult } from "../../type_define/type_define";
import { SnapSetting } from "../snap_setting";

/**
 *  几何吸附基类
 *  主要处理几何计算,结果返回等
 */
export abstract class GeoSnap<T> {
    protected _snapSetting = SnapSetting.instance();

    public abstract getType(): EN_GeoSnapType

    public abstract execute(): T_GeoSnapResult<T> | undefined
}