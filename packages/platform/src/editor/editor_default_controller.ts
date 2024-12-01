import { I_MouseEvent } from "@gene/render";
import { CmdActionController } from "../cmd/cmd_action_controller";
import { Selection } from "../selection/selection";
import { TransformElement, Vec2 } from "@gene/core";
import { app } from "../app/app";
import { EN_PlatFormCmdIds } from "../cmd/en_cmd_ids";

/**
 * 编辑子环境默认控制器
 */
export class EditorDefaultController extends CmdActionController {
    private dragPos: Vec2 | undefined = undefined;


    public onClick(event: I_MouseEvent) {
        const pos = event.pos;
        const pickGNode = this.getCanvas().pickElement(pos);
        if (!pickGNode) {
            Selection.instance().clear();
            this._updateView();
            return false;
        }

        if (pickGNode && pickGNode.elementId.isValid()) {
            Selection.instance().reset([pickGNode.elementId.asInt()]);
            this._updateView();
        }
        return false;
    }

    public onDragStart(event: I_MouseEvent) {
        const gNode = this.getCanvas().pickElement(event.pos);
        if (gNode && gNode.elementId) {
            if (this.getDoc().getElementByIdEnsure(gNode.elementId).isLike(TransformElement)) {
                this.dragPos = new Vec2().copy(event.pos);
                return true;
            }
        }
        return false;
    }

    public onDragMove(_event: I_MouseEvent) {
        if (this.dragPos !== undefined) {
            app.cmdMgr.sendCmd(EN_PlatFormCmdIds.CMD_DRAG_TRANSFORM, this.dragPos);
            return true;
        }
        return false;
    }

    public onDragEnd(_event: I_MouseEvent) {
        this.dragPos = undefined;
        return false;
    }
}
