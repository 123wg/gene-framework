import { I_MouseEvent } from "@gene/render";
import { CmdActionController } from "./cmd_action_controller";

/**
 * 编辑子环境默认控制器
 */
export class EditorDefaultController extends CmdActionController {
    public onMouseMove(_event: I_MouseEvent): boolean {
        console.log('鼠标移动===');
        return false;
    }
}
