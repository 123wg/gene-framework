import { T_XY } from "@gene/core";
import { Action } from "../action";
import { I_MouseEvent } from "@gene/render";

export type T_PickResult = {
    /**pick到的点*/
    point: T_XY
}


/**
 * 取点的action
 */
export class PickPointAction extends Action<T_PickResult> {
    public onMouseMove(event: I_MouseEvent) {
        console.log(event.pos);
        return true;
    }
}