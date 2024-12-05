import { MathUtil, Transform, TransformElement, UpdateTransformRequest, Vec2 } from "@gene/core";
import { Selection } from "../../selection/selection";
import { Cmd } from "../cmd";
import { registerCmd } from "../cmd_decorator";
import { EN_PlatFormCmdIds } from "../en_cmd_ids";
import { I_MouseEvent } from "@gene/render";
import { app } from "../../app/app";

/**
 * 拖拽Transform对象命令
 */
@registerCmd(EN_PlatFormCmdIds.CMD_DRAG_TRANSFORM)
export class DragTransformCmd extends Cmd {
    public executeImmediately = false;

    private _prePos: Vec2;

    private _dragElement: TransformElement;

    public async execute(prePos: Vec2) {
        const selIds = Selection.instance().getSelectedElementIds();
        if (!selIds.length) return;
        this._dragElement = this.getDoc().getElementByIdEnsure(selIds[0]);
        if (!this._dragElement.isLike(TransformElement)) {
            this.cancel();
            return;
        }
        this._prePos = prePos;
        app.requestMgr.startSession();
    }

    public onDragMove(event: I_MouseEvent) {
        const transform = this._dragElement.getTransform();

        const delta = new Vec2().copy(event.pos).subtract(this._prePos);

        const attrs = transform.decompose();
        attrs.x += delta.x;
        attrs.y += delta.y;
        // TODO 把这里的转化放进Transform的类里
        const newTrans = new Transform();
        newTrans.translate(attrs.x, attrs.y);
        newTrans.rotate(MathUtil.degToRad(attrs.rotation));
        newTrans.scale(attrs.scaleX, attrs.scaleY);

        const req = app.requestMgr.createRequest(UpdateTransformRequest, this._dragElement.id.asInt(), newTrans, false);
        app.requestMgr.commitRequest(req);
        this._prePos = new Vec2().copy(event.pos);
        this._updateView();
        return true;
    }

    public onMouseUp(_event: I_MouseEvent) {
        app.requestMgr.commitSession();
        this.cancel();
        return false;
    }
}