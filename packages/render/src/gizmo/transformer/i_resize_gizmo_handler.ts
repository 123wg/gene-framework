import { Vec2 } from "@gene/core";

/**
 * Resize数据处理接口
 */
export interface I_ResizeGizmoHandler {
    /**获取几何数据*/
    getGeoms(): Array<Vec2>
}