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

    constructor();
    constructor(x: number, y: number);
    constructor(xy: I_Vec2);
    constructor(pointA: I_Vec2, pointB: I_Vec2);
    constructor(xy: number[])
    constructor(a?: unknown, b?: unknown) {
        const va = a as I_Vec2;
        const vb = b as I_Vec2;
        if (b !== undefined) {
            if (typeof b === 'number') {
                this._reset(a as number, b);
            } else {
                this._reset(vb.x - va.x, vb.y - va.y);
            }
        } else if (a instanceof Array) {
            this._reset(a[0], a[1]);
        } else if (a) {
            this._reset(va.x, va.y);
        } else {
            this._reset(0, 0);
        }
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
        return this;
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
     * 从this到vec的有向角, 区间[0, 2 * PI]
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
     * 向量的旋转，改变自己
     */
    public vecRotate(angle: number): this {
        const mod = angle % MathUtil.PI2;
        if (MathUtil.isNearly0(mod)) {
            return this;
        }
        if (MathUtil.isNearlyEqual(MathUtil.PI_2, mod)) {
            [this.x, this.y] = [-this.y, this.x];
            return this;
        }
        if (MathUtil.isNearlyEqual(-MathUtil.PI_2, mod)) {
            [this.x, this.y] = [this.y, -this.x];
            return this;
        }
        if (MathUtil.isNearlyEqual(MathUtil.PI, Math.abs(mod))) {
            [this.x, this.y] = [-this.x, -this.y];
            return this;
        }
        if (MathUtil.isNearlyEqual(3 * MathUtil.PI_2, mod)) {
            [this.x, this.y] = [this.y, -this.x];
            return this;
        }
        if (MathUtil.isNearlyEqual(-3 * MathUtil.PI_2, mod)) {
            [this.x, this.y] = [-this.y, this.x];
            return this;
        }
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const { x, y } = this;
        [this.x, this.y] = [x * cosA - y * sinA, x * sinA + y * cosA];
        return this;
    }

    /**
     * 向量的旋转，得到一个新对象
     */
    public vecRotated(angle: number): Vec2 {
        return this.clone().vecRotate(angle);
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

    private _reset(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}