import { Vec2 } from "../math/vec2";

/**
 * 计算吸附主客体几何数据等
 */
export interface I_SnapGeoHelper {
    /**获取所有物体包围盒角点和中心点*/
    getAllElementsRectPoints(): Array<Vec2>
}