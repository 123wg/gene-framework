import { EN_ActionStatus } from "../type_define/type_define";
import { ActionResult } from "./action_result";
import { CmdActionController } from "./cmd_action_controller";

/**
 * 公共交互动作基类
 */
export class Action<T = unknown> extends CmdActionController<ActionResult<T>> {
    protected _markSuccess(data: T) {
        super._resolve(new ActionResult(EN_ActionStatus.OK, data));
    }

    protected _markCanceled() {
        super._resolve(new ActionResult(EN_ActionStatus.CANCEL));
    }

    public cancel(): void {
        this._markCanceled();
    }
}
