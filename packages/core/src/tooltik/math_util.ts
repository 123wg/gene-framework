import { Ln2 } from "../math/ln2";
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

    /**参数区间最大值*/
    public static MAX_INTERVAL_VALUE = 1e6;

    /**默认角度容差*/
    public static TOL_ANGLE = 1e-6;

    /**长度容差*/
    public static TOL_LENGTH = 1e-6;

    /**默认double数值级别容差*/
    public static TOL_NUMBER = 1e-6;

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

    /**
     * 根据点生成45度间隔线
     */
    public static getLinesRotate45(point: Vec2) {
        const lines: Ln2[] = [];
        for (let i = 0; i < 4; i += 1) {
            const dir = Vec2.X().vecRotate(Math.PI / 4 * i);
            const line = new Ln2(point, point.added(dir));
            lines.push(line);
        }
        return lines;
    }

    /**
     * 根据传入点数组生成矩形
     */
    public static createRectByPoints(points: Vec2[]): T_Rect {
        // 初始化最小和最大值
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        points.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
}