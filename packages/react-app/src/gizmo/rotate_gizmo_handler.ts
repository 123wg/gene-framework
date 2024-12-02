import { CoreConfig, I_SignalEvent, MathUtil, SignalHook, Transform, TransformElement, UpdateTransformRequest, Vec2 } from "@gene/core";
import { app } from "@gene/platform";
import type { I_RotateGizmoHandler, RotateGizmo, T_RotateGizmoGeo } from "@gene/render";

/**
 * 旋转数据处理器
 */
export class RotateGizmoHandler implements I_RotateGizmoHandler {
    private _element: TransformElement;

    private _rotateGizmo: RotateGizmo;

    private _signalHook = new SignalHook(this);

    constructor(element: TransformElement) {
        this._element = element;
    }

    public setGizmo(gizmo: RotateGizmo): void {
        this._rotateGizmo = gizmo;
        this._signalHook.listen(this._rotateGizmo.dragStartSignal, this._onDragStart)
            .listen(this._rotateGizmo.dragMoveSignal, this._onDragMove)
            .listen(this._rotateGizmo.dragEndSignal, this._onDragEnd);
    }

    private _onDragStart() {
        app.requestMgr.startSession();
    };

    private _onDragMove(evt: I_SignalEvent<RotateGizmo, Transform>) {
        if (!evt.data) return;
        const req = app.requestMgr.createRequest(UpdateTransformRequest, this._element.id.asInt(), evt.data);
        app.requestMgr.commitRequest(req);
    }

    private _onDragEnd() {
        app.requestMgr.commitSession();
    }

    public getGeoms(): T_RotateGizmoGeo {
        // 获取原始角点0-1 的中点往上
        const rect = this._element.getGRep().getClientRect();
        const transform = this._element.getTransform();
        const points = MathUtil.getCornerPoints(rect);
        const transPoints = points.map(_ => {
            const transP = transform.point(_);
            return new Vec2(transP.x, transP.y);
        });
        const p0 = points[0];
        const p1 = points[1];
        const dir = p1.subtracted(p0);
        const start = p0.midTo(p1);
        const newDir = dir.vecRotated(-Math.PI / 2).normalized();
        const end = start.added(newDir.multiplied(CoreConfig.rotateGizmoLineLength));

        const sPos = transform.point(start);
        const ePos = transform.point(end);
        const newStart = new Vec2(sPos.x, sPos.y);
        const newEnd = new Vec2(ePos.x, ePos.y);
        const originCenter = points[0].midTo(points[2]);
        const centerPos = transform.point(originCenter);
        const center = new Vec2(centerPos.x, centerPos.y);

        // 判断角度是否需要翻转,根据start->end方向与rx方向判断,右侧的不需要翻转,左侧的需要翻转
        const rx = transPoints[1].subtracted(transPoints[0]);
        const startToEnd = newEnd.subtracted(newStart);
        const flip = rx.cross(startToEnd) > 0;
        return {
            start: newStart,
            end: newEnd,
            center,
            originCenter,
            flip
        };
    }
}