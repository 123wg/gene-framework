import { DebugUtil } from "../tooltik/debug_util";
import { MathUtil } from "../tooltik/math_util";
import { EN_UserName } from "../tooltik/user_name";
import { T_Interval } from "../type_define/type_define";

/**
 * 参数区间
 */
export class Interval {
    protected _min: number;

    protected _max: number;
    /**
     * 默认的无限大参数域
     */
    public static infinit(): Interval {
        return new Interval(-MathUtil.MAX_INTERVAL_VALUE, MathUtil.MAX_INTERVAL_VALUE);
    }

    /**
     * 返回默认的无限大参数域
     */
    public static infinitArray(): T_Interval {
        return [-MathUtil.MAX_INTERVAL_VALUE, MathUtil.MAX_INTERVAL_VALUE];
    }


    constructor();
    /**
     * @param autoReset min > max时 是否自动交换
     */
    constructor(min: number, max: number, autoReset?: boolean)

    constructor(min?: number, max?: number, autoReset?: boolean) {
        if (min !== undefined && max !== undefined) {
            if (min < max) {
                this._min = min;
                this._max = max;
            } else if (autoReset) {
                this._min = max;
                this._max = min;
            } else {
                // 逼近0 
                this._min = min;
                this._max = max;
            }
        }
    }

    public get min() {
        return this._min;
    }

    public set min(v: number) {
        DebugUtil.assert(v < this._max || MathUtil.isNearlyEqual(v, this._max), `min > this._max ${v} ${this._max}`, EN_UserName.GENE, '2024-12-03');
        this._min = v < this.max ? v : this.max;
    }

    public get max() {
        return this._max;
    }

    public set max(v: number) {
        DebugUtil.assert(this._min < v || MathUtil.isNearlyEqual(v, this._min), `max < this._min ${v} ${this._min}`, EN_UserName.GENE, '2024-12-03');
        this._max = v > this.min ? v : this.min;
    }

    public set(min: number, max: number): this {
        DebugUtil.assert(min < max || MathUtil.isNearlyEqual(min, max), `min > max ${min} ${max}`, EN_UserName.GENE, '2024-12-03');
        this._min = min;
        this._max = max > min ? max : min;
        return this;
    }

    /**
     * 返回区间长度
     */
    public getLength(): number {
        return this._max - this._min;
    }

    /**
     * 返回区间中点
     */
    public getMid(): number {
        return (this._max + this._min) / 2;
    }

    /**
     * 包含坐标轴上的一个点
     * @param param
     * @param tolerance
     */
    public containsPt(param: number, tolerance: number = MathUtil.TOL_NUMBER): boolean {
        const t = tolerance;
        return param + t >= this._min && param - t <= this._max;
    }
}