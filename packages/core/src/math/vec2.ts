import { MathUtil } from "../tooltik/math_util";
import { I_Vec2 } from "../type_define/type_define";

/**
 * 二维向量
 */
export class Vec2 implements I_Vec2 {

    public x: number;

    public y: number;

    public static O(): Vec2 {
        return new Vec2(0, 0);
    }

    public static X(x: number = 1) {
        return new Vec2(x, 0);
    }

    public static Y(y: number = 1): Vec2 {
        return new Vec2(0, y);
    }

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public add(vec: I_Vec2) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    public added(vec: I_Vec2) {
        return new Vec2(this.x + vec.x, this.y + vec.y);
    }

    /**
     * 向量减
     */
    public subtract(vec: I_Vec2) {
        this.x -= vec.x;
        this.y -= vec.y;
    }

    /**
     * 向量减
     */
    public subtracted(vec: I_Vec2) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    }

    /**
     * 向量乘
     */
    public multiply(scale: number) {
        this.x *= scale;
        this.y *= scale;
        return this;
    }

    /**
     * 向量乘
     */
    public multiplied(scale: number) {
        return new Vec2(this.x * scale, this.y * scale);
    }

    /**
     * 点积
     */
    public dot(vec: I_Vec2) {
        return this.x * vec.x + this.y * vec.y;
    }

    /**
     * 叉乘
     */
    public cross(vec: I_Vec2) {
        return this.x * vec.y - this.y * vec.x;
    }

    /**
     * 反向
     */
    public reverse() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * 反向
     */
    public reversed() {
        return new Vec2(-this.x, -this.y);
    }

    /**
     * 中点
     */
    public midTo(vec: I_Vec2) {
        return new Vec2((this.x + vec.x) / 2, (this.y + vec.y) / 2);
    }

    /**
     * 长度
     */
    public getLength() {
        return Math.sqrt(this.getSqLength());
    }

    /**
     * 平方距离
     */
    public getSqLength() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * 归一化
     */
    public normalize() {
        const len2 = this.getSqLength();
        if (MathUtil.isNearlyEqual(len2, 1)) return this;
        const len = Math.sqrt(len2);
        const newX = this.x / len;
        const newY = this.y / len;
        this.x = newX;
        this.y = newY;
        return this;
    }

    public normalized() {
        return this.clone().normalize();
    }

    /**
     * 两向量的夹角,区间[0,PI]
     */
    public angle(vec: I_Vec2) {
        return Math.atan2(Math.abs(this.cross(vec)), this.dot(vec));
    }

    /**
     * 从this到vec的有向角
     */
    public angleTo(vec: I_Vec2) {
        const crossed = this.cross(vec);
        const angle = this.angle(vec);

        if (crossed < 0.0 && angle < Math.PI && angle > 0) {
            return Math.PI * 2 - angle;
        }
        return angle;
    }

    /**
     * 两向量是否平行(同向或反向)
     */
    public isParallel(vec: I_Vec2, tolerance = 1e-6) {
        const v1 = this.normalized();
        const v2 = new Vec2(vec.x, vec.y).normalized();
        const cross = Math.abs(v1.cross(v2));

        return cross < tolerance;
    }

    /**
     * 向量是否垂直
     */
    public isPerpendicular(vec: I_Vec2, tolerance = 1e-6) {
        return Math.abs(this.dot(vec)) < tolerance;
    }

    /**
     * 与另一向量的距离
     */
    public distanceTo(vec: I_Vec2) {
        return this.subtracted(vec).getLength();
    }

    /**
     * 与另一向量的平方距离
     */
    public sqDistanceTo(vec: I_Vec2) {
        return this.subtracted(vec).getSqLength();
    }

    /**
     * 是否相等
     */
    public equals(vec: I_Vec2) {
        return this.sqDistanceTo(vec) < 1e-6 * 1e-6;
    }

    /**
     * 位移
     */
    public translated(vec: I_Vec2) {
        return this.added(vec);
    }

    /**
     * 克隆
     */
    public clone() {
        return new Vec2(this.x, this.y);
    }

    /**
     * vec拷贝到this
     */
    public copy(vec: I_Vec2) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    }
}