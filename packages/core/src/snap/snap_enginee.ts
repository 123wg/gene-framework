import { SnapBase } from "./snap_base";

/**
 * 吸附引擎，执行吸附的入口
 */
export class SnapEnginee {

    /**
     * 执行吸附
     */
    // TODO 传实例和参数
    public static doSnap(snap: SnapBase) {
        const result = snap.doSnap();
        return result;
    }
}