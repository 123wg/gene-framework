import { T_Constructor } from "../type_define/type_guard";
import { SnapBase } from "./snap_base";

/**
 * 吸附引擎，执行吸附的入口
 */
export class SnapEnginee {

    /**
     * 执行吸附
     */
    public static doSnap<T extends T_Constructor<SnapBase>>(snapCls: T, ...args: ConstructorParameters<T>) {
        const snap = new snapCls(...args);
        return snap.doSnap();
    }
}