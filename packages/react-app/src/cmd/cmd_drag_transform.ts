
import { app, Cmd, registerCmd, Selection } from "@gene/platform";
import { I_MouseEvent } from "@gene/render";
import { EN_AppCmd } from "./cmd_id";
import { GRep, SnapEnginee, Transform, TransformElement, UpdateTransformRequest, Vec2 } from "@gene/core";
import { TransformMoveSnap } from "../snap/transform_move_snap";

/**
 * 拖拽Transform对象命令
 */
@registerCmd(EN_AppCmd.DRAG_TRANSFORM_CMD)
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

        const snapResult = SnapEnginee.doSnap(TransformMoveSnap, this._dragElement, delta);
        delta.add({ x: snapResult.dx, y: snapResult.dy });

        this.clearTmp();
        if (snapResult.previewNodes.length) {
            const grep = new GRep();
            grep.addNodes(snapResult.previewNodes);
            this.drawTmpGRep(grep);
        }
        this._updateView();

        if (delta.getLength() === 0) return true;

        const attrs = transform.decompose();
        attrs.x += delta.x;
        attrs.y += delta.y;
        const newTrans = new Transform();
        newTrans.compose(attrs);

        const req = app.requestMgr.createRequest(UpdateTransformRequest, this._dragElement.id.asInt(), newTrans, false);
        app.requestMgr.commitRequest(req);
        this._prePos = this._prePos.add(delta);
        return true;
    }

    public onMouseUp(_event: I_MouseEvent) {
        app.requestMgr.commitSession();
        this.cancel();
        return false;
    }
}