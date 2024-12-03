import { T_SnapResult } from "../../type_define/type_define";

/**
 * 吸附策略
 */
export abstract class SnapStrategy {
    public abstract doSnap(): T_SnapResult

    // TODO 绘制临时显示对象等
}