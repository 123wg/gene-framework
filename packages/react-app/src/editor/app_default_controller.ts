import { Vec2 } from "@gene/core";
import { CmdMgr, EditorDefaultController } from "@gene/platform";
import { EN_AppCmd } from "../cmd/cmd_id";

/**
 * 应用层默认控制器
 */
export class AppDefaultController extends EditorDefaultController {
    public sendDragMoveCmd(pos: Vec2): void {
        CmdMgr.instance().sendCmd(EN_AppCmd.DRAG_TRANSFORM_CMD, pos);
    }
}