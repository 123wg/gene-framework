import { Vec2 } from "@gene/core";
import { ResizeGizmo } from "./resize_gizmo";

export type T_ResizeGizmoGeoms = {
    /**未经变换的原始包围盒角点*/
    originPoints: Array<Vec2>

    /**变换后的夹紧包围盒角点*/
    points: Array<Vec2>
}

/**
 * Resize数据处理接口
 */
export interface I_ResizeGizmoHandler {
    setGizmo(gizmo: ResizeGizmo): void
    /**获取几何数据*/
    getGeoms(): T_ResizeGizmoGeoms
}