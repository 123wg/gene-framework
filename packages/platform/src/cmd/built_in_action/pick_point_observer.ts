import { PickFilter } from "./pick_filter";
import { T_PickPointResult } from "./pick_point_action";

/**
 * 点拾取监听对象参数
 */
export type T_PickPointObserverParam = {
    pickFilter?: PickFilter
    movingCallback?: (pos: T_PickPointResult) => void
    clickCallback?: (pos: T_PickPointResult) => void
}


/**
 * 取点行为观察对象,用于方法注入,如何显示拾取到的对象等
 */
export class PickPointObserver {
    /**鼠标移动回调*/
    protected _movingCallback?: (pos: T_PickPointResult) => void;

    /**点击回调*/
    protected _clickCallback?: (result: T_PickPointResult) => void;

    /**过滤器*/
    private _pickFilter?: PickFilter;

    constructor(param?: T_PickPointObserverParam) {
        this._movingCallback = param?.movingCallback;
        this._clickCallback = param?.clickCallback;
        this._pickFilter = param?.pickFilter;
    }

    /**
     * 监听移动点回调
     * @param result pick的结果
     * @returns 回调&执行成功返回true
     */
    public onMovePoint(result: T_PickPointResult): boolean {
        if (this._movingCallback) {
            this._movingCallback(result);
            return true;
        }
        return false;
    }

    /**
     * 点击回调
     */
    public onClickPoint(result: T_PickPointResult) {
        if (this._clickCallback) {
            this._clickCallback(result);
        }
    }

    /**
     * 获取过滤器
     */
    public getPickFilter() {
        return this._pickFilter;
    }

    /**
     * 设置过滤器
     */
    public setPickFilter(filter: PickFilter) {
        this._pickFilter = filter;
    }

    public getClickCallback() {
        return this._clickCallback;
    }

    public getMovingCallback() {
        return this._movingCallback;
    }

    public setClickCallbacl(callback: (pos: T_PickPointResult) => void) {
        this._clickCallback = callback;
    }

    public setMovingCallback(callback: (pos: T_PickPointResult) => void) {
        this._movingCallback = callback;
    }
}