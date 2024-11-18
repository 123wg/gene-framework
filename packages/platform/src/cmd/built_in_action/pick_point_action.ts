import { T_XY } from "@gene/core";
import { Action } from "../action";
import { I_MouseEvent } from "@gene/render";

export type T_PickPointResult = {
    /**pick到的点*/
    point: T_XY
}


/**
 * 取点的action
 */
// TODO 暂不考虑吸附
export class PickPointAction extends Action<T_PickPointResult> {

    /**当前鼠标位置*/
    private _curMousePos: T_XY;

    private _curPickResult: T_PickPointResult;
    public onMouseMove(event: I_MouseEvent) {
        this._curMousePos = event.pos;
        const result: T_PickPointResult = {
            point: event.pos
        };
        this._curPickResult = result;
        return true;
    }

    public onClick(event: I_MouseEvent) {
        this._curMousePos = event.pos;
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
}