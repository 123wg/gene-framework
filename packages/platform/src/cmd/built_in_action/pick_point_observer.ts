import { T_PickPointResult } from "./pick_point_action";

export type T_PickPointObserverParam = {
    movingCallback?: (pos: T_PickPointResult) => void
}


/**
 * 取点行为观察对象,用于方法注入,如如何显示拾取到的对象等
 */
export class PickPointObserver {
    /**鼠标移动回调*/
    protected _movingCallBack?: (pos: T_PickPointResult) => void;

    constructor(param?: T_PickPointObserverParam) {
        this._movingCallBack = param?.movingCallback;
    }

    /**
     * 监听移动点回调
     */
    public onMovePoint(result: T_PickPointResult) {
        if (this._movingCallBack) {
            this._movingCallBack(result);
        }
    }
} 