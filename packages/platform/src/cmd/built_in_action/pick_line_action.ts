import { GCircle, GLine, GRep } from "@gene/core";
import { Action } from "../action";
import { PickPointAction, T_PickPointResult } from "./pick_point_action";
import { PickPointObserver } from "./pick_point_observer";
import { PlatFormConfig } from "../../toolkit/platform_config";

/**
 * 画线动作参数
 */
export type T_PickLineParam = {
    onLineUpdate?: (first?: T_PickPointResult, second?: T_PickPointResult) => void
}


/**
 * 画线
 */
export class PickLineAction extends Action<[T_PickPointResult, T_PickPointResult]> {
    private _onLineUpdate?: (first?: T_PickPointResult, second?: T_PickPointResult) => void;
    constructor(param?: T_PickLineParam) {
        super();
        this._onLineUpdate = param?.onLineUpdate;
    }

    public async execute() {
        const observer1 = new PickPointObserver({
            movingCallback: (result: T_PickPointResult) => {
                if (this._onLineUpdate) {
                    this._onLineUpdate(result);
                    return;
                }
                this._drawLinePreview(result);
            }
        });
        // 第一次取点
        const p1 = await this.runAction(new PickPointAction(observer1));
        if (p1.isCanceled) {
            this._markCanceled();
            return;
        }

        const observer2 = new PickPointObserver({
            movingCallback: (result: T_PickPointResult) => {
                if (this._onLineUpdate) {
                    this._onLineUpdate(result);
                    return;
                }
                this._drawLinePreview(p1.data, result);
            }
        });
        // 第二次取点
        const p2 = await this.runAction(new PickPointAction(observer2));
        if (p2.isCanceled) {
            this._markCanceled();
            return;
        }

        this._markSuccess([p1.data, p2.data]);
    }

    /**
     * 默认的划线预览
     */
    private _drawLinePreview(p1?: T_PickPointResult, p2?: T_PickPointResult) {
        this.clearTmp();
        if (!p1) return;
        const grep = new GRep();
        const gPoint1 = new GCircle({
            radius: PlatFormConfig.pickPointSize,
            x: p1.point.x,
            y: p1.point.y
        });
        gPoint1.setStyle(PlatFormConfig.pickPointStyle);
        grep.addNode(gPoint1);

        if (!p2) {
            this.drawTmpGRep(grep);
            this._updateView();
            return;
        }
        const gPoint2 = new GCircle({
            radius: PlatFormConfig.pickPointSize,
            x: p2.point.x,
            y: p2.point.y
        });
        gPoint2.setStyle(PlatFormConfig.pickPointStyle);
        grep.addNode(gPoint2);

        const gLine = new GLine({
            points: [p1.point.x, p1.point.y, p2.point.x, p2.point.y],
        });
        gLine.setStyle(PlatFormConfig.pickLineStyle);
        grep.addNode(gLine);

        this.drawTmpGRep(grep);
        this._updateView();
    }
}