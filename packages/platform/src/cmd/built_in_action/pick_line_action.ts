import { Action } from "../action";
import { PickPointAction, T_PickPointResult } from "./pick_point_action";

/**
 * 画线
 */
export class PickLineAction extends Action<[T_PickPointResult, T_PickPointResult]> {
    public async execute() {
        // 第一次取点
        const p1 = await this.runAction(new PickPointAction());
        if (p1.isCanceled) {
            this._markCanceled();
            return;
        }

        // 第二次取点
        const p2 = await this.runAction(new PickPointAction());
        if (p2.isCanceled) {
            this._markCanceled();
            return;
        }

        this._markSuccess([p1.data, p2.data]);
    }
}