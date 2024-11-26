import { T_Rect } from "@gene/core";

/**
 * Resize数据处理接口
 */
export interface I_ResizeGizmoHandler {
    /**获取几何数据*/
    getGeoms(): T_Rect
}