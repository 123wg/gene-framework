import { DebugUtil } from "../tooltik/debug_util";
import { MathUtil } from "../tooltik/math_util";
import { EN_UserName } from "../tooltik/user_name";
import { I_Vec2, T_Interval } from "../type_define/type_define";
import { Interval } from "./interval";
import { Vec2 } from "./vec2";

/**
 * 二维直线
 */
export class Ln2 {
    /**原点*/
    protected _origin = Vec2.O();

    /**方向*/
    private _dir = Vec2.X();

    /**参数域*/
    protected _range: Interval = Interval.infinit();

    constructor();
    constructor(start: I_Vec2, end: I_Vec2);
    constructor(origin: I_Vec2, dir: I_Vec2, range: T_Interval)
    constructor(p1?: I_Vec2, p2?: I_Vec2, range?: T_Interval) {
        if (!range && p1 && p2) {
            this.reset(p1, p2);
            return;
        }
        if (p1 && p2 && range) {
            this._origin = new Vec2(p1);
            this._dir = new Vec2(p2);
            this._dir.normalize();
            this._range = new Interval(range[0], range[1]);
        }
    }

    public reset(start: I_Vec2, end: I_Vec2) {
        const ab = new Vec2(start, end);
        const len = ab.getLength();
        if (len < 1e-12) {
            DebugUtil.assert(false, 'two points are too near to determine line direction', EN_UserName.GENE, '2024-12-03');
            this._dir = Vec2.X();
        } else {
            this._dir = ab.multiply(1 / len);
        }

        this._origin = new Vec2(start);
        this._range = new Interval(0, len);
    }
    /**
     * 获取直线的原点（参数为零的点）
     */
    public getOrigin() {
        return this._origin;
    }

    /**
     * 设置直线的原点（参数为零的点）
     */
    public setOrigin(origin: I_Vec2) {
        return this._origin.copy(origin);
    }

    /**
     *  获取方向向量
     */
    public getDirection(): Vec2 {
        return this._dir.clone();
    }

    /**
     * 设置方向向量
     */
    public setDirection(dir: I_Vec2) {
        this._dir = new Vec2(dir).normalize();
    }

    /**
     * 获取左侧的法向（为直线方向逆时针转90度）
     */
    public getLeftNormal(): Vec2 {
        const perp = new Vec2(-this._dir.y, this._dir.x).normalize();
        return perp;
    }

    /**
     * 获取右侧的法向（为直线方向顺时针转90度）
     */
    public getRightNormal(): Vec2 {
        return this.getLeftNormal().reverse();
    }

    /**
     * 是否和另一条直线平行
     * @param another
     * @param tol
     */
    public isParallelTo(another: Ln2, tol = MathUtil.TOL_ANGLE) {
        return this._dir.isParallel(another._dir, tol);
    }

    /**
     * 是否和另一条直线垂直
     * @param another
     * @param torlerance
     */
    public isPerpendicularTo(another: Ln2, torlerance = MathUtil.TOL_ANGLE) {
        return this._dir.isPerpendicular(another._dir, torlerance);
    }
    /**
     * 获取某参数对应的点
     */
    public getPtAt(t: number): Vec2 {
        return this._dir.multiplied(t).add(this._origin);
    }

    /**
     *  获取某点（点也可以不在直线上）对应的参数t。如果点可以在直线外，则返回点在直线上最近点的参数t
     */
    public getParamAt(point: I_Vec2): number {
        const refVec: Vec2 = new Vec2(point).subtract(this._origin);
        return refVec.dot(this._dir);
    }

    /**
     * 获取参数域的拷贝
     */
    public getRange(): Interval {
        return this._range;
    }


    /**
     * 获取曲线起点处参数值
     */
    public getStartParam(): number {
        return this.getRange().min;
    }

    /**
     * 获取曲线末点处参数值
     */
    public getEndParam(): number {
        return this.getRange().max;
    }


    /**
     * 获取曲线起点
     */
    public getStartPt(): Vec2 {
        const startT = this.getStartParam();
        return this.getPtAt(startT);
    }

    /**
     * 获取曲线末点
     */
    public getEndPt(): Vec2 {
        const endT = this.getEndParam();
        return this.getPtAt(endT);
    }

    /**
     * 获取曲线中点
     */
    public getMidPt(): Vec2 {
        return this.getPtAt(this.getRange().getMid());
    }

    /**
     * 获取离直线段最近的点
     * @param point
     * @param tol
     */
    public getClosestPoint(point: I_Vec2): Vec2 {
        const t = this.getParamAt(point);
        if (t < this._range.min) {
            return this.getStartPt();
        }
        if (t > this._range.max) {
            return this.getEndPt();
        }
        return this.getPtAt(t);
    }

    /**
     *  获取曲线(给定参数域区间段的)长度
     */
    public getLength(range?: Interval): number {
        if (range !== undefined) {
            return range.getLength();
        }

        return this._range.getLength();
    }

    /**
     * 反向
     */
    public reverse(): this {
        this._dir.reverse();
        this._range.set(-this._range.max, -this._range.min);
        return this;
    }


    /**
     * point投影在curve上的点p是否在曲线上
     * @param point
     */
    public containsProjectedPt(point: I_Vec2): boolean {
        const param = this.getParamAt(point);
        return this._range.containsPt(param);
    }

    /**
     * 是否包含某个点, 即某点是否在该曲线段上
     */
    public containsPt(point: I_Vec2, tolerance = MathUtil.TOL_LENGTH): boolean {
        const sqrEps = tolerance * tolerance;
        // 1.判断端点的距离
        if (this.getStartPt().sqDistanceTo(point) < sqrEps || this.getEndPt().sqDistanceTo(point) < sqrEps) {
            return true;
        }
        // 2.判断垂直距离
        const param = this.getParamAt(point);
        const d = this.getPtAt(param).sqDistanceTo(point);
        if (d > sqrEps) {
            return false;
        }

        // 3.判断参数域
        return this._range.containsPt(param, tolerance);
    }

    /**
     * 点到曲线的垂足
     */
    public getProjectedPtBy(point: I_Vec2) {
        const p = this.getParamAt(point);
        return this.getPtAt(p);
    }

    /**
     * 延伸曲线,若曲线参数域为[0,1]
     * > 从尾部增加1，参数域变为[0,2]
     *
     * > 从头部增加1，参数域变为[-1,1]
     * @param howLong 延伸长度
     * @param bTail 是否从尾部增加
     */
    public extend(howLong: number, bTail: boolean = true): this {
        if (bTail) {
            this._range.max += howLong;
        } else {
            this._range.min -= howLong;
        }
        return this;
    }

    /**
     * 从参数域的2端延伸曲线
     * @param howLong 延伸长度
     */
    public extendDouble(howLong: number): this {
        this._range.max += howLong;
        this._range.min -= howLong;

        return this;
    }
}