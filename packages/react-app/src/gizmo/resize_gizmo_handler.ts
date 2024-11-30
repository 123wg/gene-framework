import { I_ResizeGizmoHandler, ResizeGizmo, T_ResizeGizmoGeoms } from "@gene/render";
import { I_SignalEvent, MathUtil, SignalHook, Transform, Vec2 } from "@gene/core";
import { app } from "@gene/platform";
import { TransformElement, UpdateTransformRequest } from "@gene/editor-sdk";

/**
 * 变换大小数据处理器
 */
export class ResizeGizmoHandler implements I_ResizeGizmoHandler {
    private _element: TransformElement;

    private _resizeGizmo: ResizeGizmo;

    private _signalHook = new SignalHook(this);
    constructor(element: TransformElement) {
        this._element = element;
    }

    /**
     * 设置关联gizmo
     */
    public setGizmo(gizmo: ResizeGizmo) {
        this._resizeGizmo = gizmo;
        this._signalHook.listen(this._resizeGizmo.dragStartSignal, this._onDragStart)
            .listen(this._resizeGizmo.dragMoveSignal, this._onDragMove)
            .listen(this._resizeGizmo.dragEndSignal, this._onDragEnd);
    }

    private _onDragStart() {
        app.requestMgr.startSession();
    };

    private _onDragMove(evt: I_SignalEvent<ResizeGizmo, Transform>) {
        if (!evt.data) return;
        const req = app.requestMgr.createRequest(UpdateTransformRequest, this._element.id, evt.data);
        app.requestMgr.commitRequest(req);
    }

    private _onDragEnd() {
        app.requestMgr.commitSession();
    }

    public getGeoms(): T_ResizeGizmoGeoms {
        // 获取夹紧的包围盒点
        const rect = this._element.getGRep().getClientRect();
        const transform = this._element.getTransform();
        const points = MathUtil.getCornerPoints(rect);
        const tPoints = points.map(_ => {
            const vec = transform.point(_);
            return new Vec2(vec.x, vec.y);
        });

        return {
            originPoints: points,
            points: tPoints
        };
    }
}