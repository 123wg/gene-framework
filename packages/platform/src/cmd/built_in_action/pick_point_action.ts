import { CoreConfig, GCircle, GRep, I_Vec2 } from "@gene/core";
import { Action } from "../action";
import { I_MouseEvent } from "@gene/render";
import { PickPointObserver } from "./pick_point_observer";

export type T_PickPointResult = {
    /**pick到的点*/
    point: I_Vec2
}


/**
 * 取点的action
 */
export class PickPointAction extends Action<T_PickPointResult> {
    /**拾取观察对象*/
    private _observer: PickPointObserver;

    /**当前鼠标位置*/
    private _curMousePos: I_Vec2;

    /**拾取结果*/
    private _curPickResult: T_PickPointResult;

    constructor(observer = new PickPointObserver()) {
        super();
        this._observer = observer;
    }
    public onMouseMove(event: I_MouseEvent) {
        this._curMousePos = event.pos;
        const result: T_PickPointResult = {
            point: event.pos
        };
        const success = this._observer.onMovePoint(result);
        if (!success) {
            this._drawPointPreview(result);
        }
        this._curPickResult = result;
        return true;
    }

    public onClick(event: I_MouseEvent) {
        this._curMousePos = event.pos;
        if (this._observer.getClickCallback() && this._curPickResult) {
            this._observer.getClickCallback()?.(this._curPickResult);
        }
        if (this._curPickResult) {
            this._markSuccess(this._curPickResult);
        } else {
            const result: T_PickPointResult = {
                point: event.pos
            };
            this._markSuccess(result);
        }
        return true;
    }

    /**
     * 默认画点预览
     */
    private _drawPointPreview(result: T_PickPointResult) {
        this.clearTmp();
        const grep = new GRep();
        const gPoint = new GCircle({
            radius: CoreConfig.previewPointSize,
            x: result.point.x,
            y: result.point.y
        });
        gPoint.setStyle(CoreConfig.previewPointStyle);
        grep.addNode(gPoint);
        this.drawTmpGRep(grep);
        this._updateView();
    }
}