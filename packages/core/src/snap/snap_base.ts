import { T_SnapResult } from "../type_define/type_define";

/**
 * 吸附基类
 */
export abstract class SnapBase {
    /**执行吸附*/
    public abstract doSnap(): T_SnapResult
}