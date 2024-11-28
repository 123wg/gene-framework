import { I_Vec2 } from "../type_define/type_define";

/**
 * 数学计算工具
 * 简单系统,暂不考虑基础数学库引入
 */
export class MathUtil {

    /**
     * 弧度转角度
     */
    public static radToDeg(radians: number) {
        return radians * (180 / Math.PI);
    }
    /**
     * 计算两点距离
     */
    public static ppDistance(p1: I_Vec2, P2: I_Vec2) {
        return Math.sqrt(Math.pow(P2.x - p1.x, 2) + Math.pow(P2.y - p1.y, 2));
    }
}