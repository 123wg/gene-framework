import { I_Vec2 } from "../type_define/type_define";
import { MathUtil } from "../tooltik/math_util";

/**
 * 二维变换
 * 可表示移动、缩放、旋转
 */
export class Transform {
    public m: Array<number>;
    constructor(m = [1, 0, 0, 1, 0, 0]) {
        this.m = (m && m.slice()) || [1, 0, 0, 1, 0, 0];
    }
    public reset() {
        this.m[0] = 1;
        this.m[1] = 0;
        this.m[2] = 0;
        this.m[3] = 1;
        this.m[4] = 0;
        this.m[5] = 0;
    }
    /**
     * Copy Konva.Transform object
     * @method
     * @name Konva.Transform#copy
     * @returns {Konva.Transform}
     * @example
     * const tr = shape.getTransform().copy()
     */
    public copy() {
        return new Transform(this.m);
    }
    public copyInto(tr: Transform) {
        tr.m[0] = this.m[0];
        tr.m[1] = this.m[1];
        tr.m[2] = this.m[2];
        tr.m[3] = this.m[3];
        tr.m[4] = this.m[4];
        tr.m[5] = this.m[5];
    }
    /**
     * Transform point
     * @method
     * @name Konva.Transform#point
     * @param {Object} point 2D point(x, y)
     * @returns {Object} 2D point(x, y)
     */
    public point(point: I_Vec2) {
        const m = this.m;
        return {
            x: m[0] * point.x + m[2] * point.y + m[4],
            y: m[1] * point.x + m[3] * point.y + m[5],
        };
    }
    /**
     * Apply translation
     * @method
     * @name Konva.Transform#translate
     * @param {Number} x
     * @param {Number} y
     * @returns {Konva.Transform}
     */
    public translate(x: number, y: number) {
        this.m[4] += this.m[0] * x + this.m[2] * y;
        this.m[5] += this.m[1] * x + this.m[3] * y;
        return this;
    }
    /**
     * Apply scale
     * @method
     * @name Konva.Transform#scale
     * @param {Number} sx
     * @param {Number} sy
     * @returns {Konva.Transform}
     */
    public scale(sx: number, sy: number) {
        this.m[0] *= sx;
        this.m[1] *= sx;
        this.m[2] *= sy;
        this.m[3] *= sy;
        return this;
    }
    /**
     * Apply rotation
     * @method
     * @name Konva.Transform#rotate
     * @param {Number} rad  Angle in radians
     * @returns {Konva.Transform}
     */
    public rotate(rad: number) {
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        const m11 = this.m[0] * c + this.m[2] * s;
        const m12 = this.m[1] * c + this.m[3] * s;
        const m21 = this.m[0] * -s + this.m[2] * c;
        const m22 = this.m[1] * -s + this.m[3] * c;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    /**
     * Returns the translation
     * @method
     * @name Konva.Transform#getTranslation
     * @returns {Object} 2D point(x, y)
     */
    public getTranslation() {
        return {
            x: this.m[4],
            y: this.m[5],
        };
    }
    /**
     * Apply skew
     * @method
     * @name Konva.Transform#skew
     * @param {Number} sx
     * @param {Number} sy
     * @returns {Konva.Transform}
     */
    public skew(sx: number, sy: number) {
        const m11 = this.m[0] + this.m[2] * sy;
        const m12 = this.m[1] + this.m[3] * sy;
        const m21 = this.m[2] + this.m[0] * sx;
        const m22 = this.m[3] + this.m[1] * sx;
        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        return this;
    }
    /**
     * Transform multiplication
     * @method
     * @name Konva.Transform#multiply
     * @param {Konva.Transform} matrix
     * @returns {Konva.Transform}
     */
    public multiply(matrix: Transform) {
        const m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
        const m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

        const m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
        const m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

        const dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
        const dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

        this.m[0] = m11;
        this.m[1] = m12;
        this.m[2] = m21;
        this.m[3] = m22;
        this.m[4] = dx;
        this.m[5] = dy;
        return this;
    }
    /**
     * Invert the matrix
     * @method
     * @name Konva.Transform#invert
     * @returns {Konva.Transform}
     */
    public invert() {
        const d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
        const m0 = this.m[3] * d;
        const m1 = -this.m[1] * d;
        const m2 = -this.m[2] * d;
        const m3 = this.m[0] * d;
        const m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
        const m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
        this.m[0] = m0;
        this.m[1] = m1;
        this.m[2] = m2;
        this.m[3] = m3;
        this.m[4] = m4;
        this.m[5] = m5;
        return this;
    }
    /**
     * return matrix
     * @method
     * @name Konva.Transform#getMatrix
     */
    public getMatrix() {
        return this.m;
    }
    /**
     * convert transformation matrix back into node's attributes
     * @method
     * @name Konva.Transform#decompose
     * @returns {Konva.Transform}
     */
    public decompose() {
        const a = this.m[0];
        const b = this.m[1];
        const c = this.m[2];
        const d = this.m[3];
        const e = this.m[4];
        const f = this.m[5];

        const delta = a * d - b * c;

        const result = {
            x: e,
            y: f,
            rotation: 0,
            scaleX: 0,
            scaleY: 0,
            skewX: 0,
            skewY: 0,
        };

        // Apply the QR-like decomposition.
        if (a != 0 || b != 0) {
            const r = Math.sqrt(a * a + b * b);
            result.rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
            result.scaleX = r;
            result.scaleY = delta / r;
            result.skewX = (a * c + b * d) / delta;
            result.skewY = 0;
        } else if (c != 0 || d != 0) {
            const s = Math.sqrt(c * c + d * d);
            result.rotation =
                Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            result.scaleX = delta / s;
            result.scaleY = s;
            result.skewX = 0;
            result.skewY = (a * c + b * d) / delta;
        } else {
            // a = b = c = d = 0
        }

        result.rotation = MathUtil.radToDeg(result.rotation);

        return result;
    }

    /**
     * 判断当前变换是否已发生变化
     * @returns {boolean} 如果变换矩阵与单位矩阵不同，则返回 true
     */
    public hasChanged(): boolean {
        // 比较当前矩阵与单位矩阵
        const unitMatrix = [1, 0, 0, 1, 0, 0];
        for (let i = 0; i < this.m.length; i++) {
            if (this.m[i] !== unitMatrix[i]) {
                return true;
            }
        }
        return false;
    }
}