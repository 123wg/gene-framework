import { GLine, GRep } from "@gene/core";
import { Action } from "../action";
import { PickPointAction, T_PickPointResult } from "./pick_point_action";
import { PickPointObserver } from "./pick_point_observer";

/**
 * 画线动作参数
 */
export type T_PickLineParam = {
    pointObserver?: PickPointObserver
    onLineUpdate?: (first: T_PickPointResult, second: T_PickPointResult) => void
}


/**
 * 画线
 */
export class PickLineAction extends Action<[T_PickPointResult, T_PickPointResult]> {
    private _pointObserver?: PickPointObserver;

    private _onLineUpdate?: (first: T_PickPointResult, second: T_PickPointResult) => void;
    constructor(param?: T_PickLineParam) {
        super();
        this._pointObserver = param?.pointObserver;
        this._onLineUpdate = param?.onLineUpdate;
    }

    public async execute() {
        const firstObserver = this._pointObserver || new PickPointObserver();
        // 第一次取点
        const p1 = await this.runAction(new PickPointAction(firstObserver));
        if (p1.isCanceled) {
            this._markCanceled();
            return;
        }

        const secondObserver = this._pointObserver || new PickPointObserver();
        // 第二个点的移动回调
        const moveCallback = secondObserver.getMovingCallback();

        // 第二个点移动,第一点消失
        const newMovingCallback = (result: T_PickPointResult) => {
            moveCallback?.(result);
            if (this._onLineUpdate) {
                this._onLineUpdate(p1.data, result);
            } else {
                this._drawLinePreview(p1.data, result);
            }
        };
        secondObserver.setMovingCallback(newMovingCallback);

        // 第二次取点
        const p2 = await this.runAction(new PickPointAction(secondObserver));
        if (p2.isCanceled) {
            this._markCanceled();
            return;
        }

        this._markSuccess([p1.data, p2.data]);
    }

    /**
     * 默认的划线预览
     */
    private _drawLinePreview(p1: T_PickPointResult, p2: T_PickPointResult) {
        this.clearTmp();
        const grep = new GRep();
        const gLine = new GLine({
            points: [p1.point.x, p1.point.y, p2.point.x, p2.point.y]
        });
        gLine.setStyle({ stroke: 'blue' });
        grep.addNode(gLine);
        this.drawTmpGRep(grep);
        this._updateView();
    }
}