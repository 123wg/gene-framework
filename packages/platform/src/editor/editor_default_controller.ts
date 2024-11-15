import { I_KeyboardEvent, I_MouseEvent } from "@gene/render";
import { CmdActionController } from "../cmd/cmd_action_controller";

/**
 * 编辑子环境默认控制器
 */
export class EditorDefaultController extends CmdActionController {
    public onMouseMove(event: I_MouseEvent): boolean {
        return super.onMouseMove(event);
    }

    public onKeyDown(_event: I_KeyboardEvent): boolean {
        return false;
    }
}
