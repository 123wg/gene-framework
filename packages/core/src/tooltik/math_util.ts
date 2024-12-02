import { Vec2 } from "../math/vec2";
import { T_Rect } from "../type_define/type_define";

/**
 * 数学计算工具
 * 简单系统,暂不考虑基础数学库引入
 */
export class MathUtil {

    public static PI2 = Math.PI * 2;

    public static PI_2 = Math.PI / 2;

    public static PI = Math.PI;

    /**
     * 误差范围内相等
     */
    public static isNearlyEqual(a: number, b: number, optTolerance: number = 1e-6): boolean {
        return Math.abs(a - b) <= optTolerance;
    }

    /**
     * 是否为0
     */
    public static isNearly0(a: number, optTolerance: number = 1e-6): boolean {
        return Math.abs(a) <= optTolerance;
    }

    /**
     * 弧度转角度
     */
    public static radToDeg(radians: number) {
        return radians * (180 / Math.PI);
    }

    /**
     * 角度转弧度
     */
    public static degToRad(degree: number) {
        return degree * (Math.PI / 180);
    }

    /**
     * 根据rect获取四个角点 左上-右上-右下-左下
     */
    public static getCornerPoints(rect: T_Rect) {
        const vec1 = new Vec2(rect.x, rect.y);
        const vec2 = vec1.added({ x: rect.width, y: 0 });
        const vec3 = vec2.added({ x: 0, y: rect.height });
        const vec4 = vec1.added({ x: 0, y: rect.height });

        return [vec1, vec2, vec3, vec4];
    }
}