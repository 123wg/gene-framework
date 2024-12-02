import { CoreConfig, GCircle, GLine, GRep, I_Vec2, Signal, Transform, Vec2 } from "@gene/core";
import { EN_MouseCursor, I_MouseEvent, T_GizmoRenderData } from "../../type_define/type_define";
import { GizmoBase } from "../gizmo_base";
import { registerGizmo } from "../gizmo_decorator";
import { EN_GizmoId } from "../gizmo_id";
import type { I_RotateGizmoHandler, T_RotateGizmoGeo } from "./i_rotate_gizmo_handler";

/**
 * 旋转控件
 */
@registerGizmo(EN_GizmoId.ROTATE_GIZMO)
export class RotateGizmo extends GizmoBase {
    private _handler: I_RotateGizmoHandler;

    /**几何信息*/
    private _geo: T_RotateGizmoGeo;

    private _grep: GRep;

    private _dragStart = false;

    /**鼠标上次拖拽位置*/
    private _dragMovePos: Vec2 | undefined;

    private _picked = false;

    public dragStartSignal = new Signal<this, undefined>(this);
    public dragMoveSignal = new Signal<this, Transform>(this);
    public dragEndSignal = new Signal<this, undefined>(this);
    constructor(handler: I_RotateGizmoHandler) {
        super();
        this._handler = handler;
        this._handler.setGizmo(this);
        this._updateGeo();
    }

    public onInit(): void {
        this._draw();
    }
    public onChange(): void {
        this._updateGeo();
        this._draw();
    }

    private _updateGeo() {
        this._geo = this._handler.getGeoms();
    }

    private _draw() {
        this._grep = this.createGRep();
        const gLine = new GLine({ points: [this._geo.start.x, this._geo.start.y, this._geo.end.x, this._geo.end.y] });
        gLine.setStyle(CoreConfig.resizeGizmoLineStyle);

        const circle = new GCircle({
            radius: CoreConfig.resizeGizmoPointSize,
            x: this._geo.end.x,
            y: this._geo.end.y
        });
        circle.setStyle(CoreConfig.resizeGizmoPointStyle);
        this._grep.addNode(gLine);
        this._grep.addNode(circle);
    }

    private _posPickEnd(pos: I_Vec2) {
        return this._geo.end.distanceTo(pos) < CoreConfig.resizeGizmoPointSize * 1.2;
    }

    private _getTransformFromPos(pos: Vec2) {
        const transform = new Transform();
        if (!this._dragMovePos) return transform;
        const from = this._dragMovePos?.subtracted(this._geo.center);
        const to = pos.subtracted(this._geo.center);
        let angle = from.angle(to);
        // 分左转和右转
        const clockwise = from.cross(to) > 0;
        // 如果有X或Y反向,角度需在翻转一次
        angle = this._geo.flip ? -angle : angle;

        transform.translate(this._geo.originCenter.x, this._geo.originCenter.y);
        transform.rotate(clockwise ? angle : -angle);
        transform.translate(-this._geo.originCenter.x, -this._geo.originCenter.y);

        return transform;
    }

    public onMouseMove(event: I_MouseEvent): boolean {
        if (this._dragStart) return true;
        const picked = this._posPickEnd(event.pos);
        this._picked = picked;
        if (picked) {
            this._canvas.setMouseCursor(EN_MouseCursor.CROSS);
        } else {
            this._canvas.setMouseCursor(EN_MouseCursor.DEFAULT);
        }
        return false;
    }

    public onDragStart(event: I_MouseEvent): boolean {
        if (!this._picked) return false;
        this._dragStart = true;
        this._dragMovePos = new Vec2().copy(event.pos);
        this.dragStartSignal.dispatch();
        return true;
    }

    public onDragMove(event: I_MouseEvent): boolean {
        if (!this._dragStart) return false;

        const vec = new Vec2().copy(event.pos);
        const transform = this._getTransformFromPos(vec);
        this._dragMovePos = vec;

        if (transform.hasChanged()) this.dragMoveSignal.dispatch(transform);
        return false;
    }

    public onDragEnd(_event: I_MouseEvent): boolean {
        if (this._dragStart) {
            this._dragStart = false;
            this._dragMovePos = undefined;
            this.dragEndSignal.dispatch();
        }
        return false;
    }

    public onRender(): T_GizmoRenderData | null {
        return {
            grep: this._grep,
            gizmoId: this.id
        };
    }
}