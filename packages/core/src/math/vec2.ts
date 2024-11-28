import { I_Vec2 } from "../type_define/type_define";

/**
 * 二维向量
 */
export class Vec2 implements I_Vec2 {

    public x: number;

    public y: number;

    // 构造函数
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    // 向量加法
    public add(v: Vec2): Vec2 {
        return new Vec2(this.x + v.x, this.y + v.y);
    }

    // 向量减法
    public subtract(v: Vec2): Vec2 {
        return new Vec2(this.x - v.x, this.y - v.y);
    }

    // 向量与标量的乘法
    public multiplyScalar(scalar: number): Vec2 {
        return new Vec2(this.x * scalar, this.y * scalar);
    }

    // 向量与标量的除法
    public divideScalar(scalar: number): Vec2 {
        if (scalar === 0) throw new Error("Cannot divide by zero");
        return new Vec2(this.x / scalar, this.y / scalar);
    }

    // 计算点积
    public dot(v: Vec2): number {
        return this.x * v.x + this.y * v.y;
    }

    // 计算叉积（在二维中是标量值）
    public cross(v: Vec2): number {
        return this.x * v.y - this.y * v.x;
    }

    // 计算向量的长度
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // 向量的平方长度
    public lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    // 归一化向量（将向量转换为单位向量）
    public normalize(): Vec2 {
        const len = this.length();
        if (len === 0) return new Vec2(0, 0);
        return new Vec2(this.x / len, this.y / len);
    }

    // 计算与另一个向量的角度（以弧度为单位）
    public angleTo(v: Vec2): number {
        const dotProduct = this.dot(v);
        const lengths = this.length() * v.length();
        if (lengths === 0) return 0; // 防止除零
        return Math.acos(dotProduct / lengths);
    }

    // 向量的反向
    public negate(): Vec2 {
        return new Vec2(-this.x, -this.y);
    }

    // 向量的缩放
    public scale(scale: Vec2): Vec2 {
        return new Vec2(this.x * scale.x, this.y * scale.y);
    }


    // 求两个向量之间的距离
    public distanceTo(v: Vec2): number {
        return Math.sqrt((v.x - this.x) ** 2 + (v.y - this.y) ** 2);
    }

    // 求两个向量之间的平方距离
    public distanceToSquared(v: Vec2): number {
        return (v.x - this.x) ** 2 + (v.y - this.y) ** 2;
    }
}