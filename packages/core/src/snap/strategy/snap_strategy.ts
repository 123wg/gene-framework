import { EN_SnapStrategyType, T_SnapResult } from "../../type_define/type_define";

/**
 * 吸附策略
 */
export abstract class SnapStrategy {
    public abstract getType(): EN_SnapStrategyType

    public abstract doSnap(): T_SnapResult
}