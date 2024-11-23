import { I_MouseEvent } from "@gene/render";
import { CmdActionController } from "../cmd/cmd_action_controller";
import { Selection } from "../selection/selection";

/**
 * 编辑子环境默认控制器
 */
export class EditorDefaultController extends CmdActionController {
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

            console.log(Selection.instance());

            this._updateView();
        }
        return false;
    }
}
