import { I_Vec2, Vec2, Transform } from "@gene/core";
import { EN_AnchorName, EN_MouseCursor, I_MouseEvent, T_GizmoRenderData } from "../../type_define/type_define";
import { GizmoBase } from "../gizmo_base";
import { registerGizmo } from "../gizmo_decorator";
import { EN_GizmoId } from "../gizmo_id";
import { CoreConfig, GCircle, GLine, GRep, Signal } from "@gene/core";
import type { I_ResizeGizmoHandler } from "./i_resize_gizmo_handler";

/**
 * 改变大小
 */
@registerGizmo(EN_GizmoId.RESIZE_GIZMO)
export class ResizeGizmo extends GizmoBase {
    /**原始包围盒点*/
    private _originPoints: Array<Vec2>;
    /**
     * 夹紧的包围盒角点
     */
    private _points: Array<Vec2>;

    private _grep: GRep;

    private _handler: I_ResizeGizmoHandler;

    /**当前hover的index*/
    public _hoverIndex = -1;

    /**是否开始拖拽*/
    private _dragStart = false;

    /**拖拽开始点坐标*/
    // private _dragStartPos: I_Vec2 | undefined;

    private _dragMovePos: I_Vec2 | undefined;

    public dragStartSignal = new Signal<this, undefined>(this);
    public dragMoveSignal = new Signal<this, Transform>(this);
    public dragEndSignal = new Signal<this, undefined>(this);


    constructor(handler: I_ResizeGizmoHandler) {
        super();
        this._handler = handler;
        this._handler.setGizmo(this);
        const geoms = this._handler.getGeoms();
        this._points = geoms.points;
        this._originPoints = geoms.originPoints;
    }

    public onInit(): void {
        this._draw();
    }

    public onChange(): void {
        const geoms = this._handler.getGeoms();
        this._points = geoms.points;
        this._originPoints = geoms.originPoints;
        this._draw();
    }

    /**
     * 判断是否pick中角点
     * @returns 角点下标
     */
    private _posPickAnchor(pos: I_Vec2) {
        const index = this._points.findIndex(_ => _.distanceTo(pos) < CoreConfig.resizeGizmoPointSize * 1.2);
        return index > -1 ? index : undefined;
    }

    /**
     * 根据位置计算变化的delta
     * 鼠标移动时,获取和上一次移动点的delta量
     * 根据原始的sin和cos 算出delta的width和height
     * 计算和初始包围盒的delta的scale为 (width+deltaW)/width
     */
    private _getTransformFromPos(pos: I_Vec2): Transform | undefined {
        const transform = new Transform();
        if (!this._dragMovePos) return;

        const hypotenuse = this._points[0].distanceTo(this._points[2]);

        let refP = new Vec2();
        let originRef = new Vec2();

        switch (this._hoverIndex) {
            case EN_AnchorName.TOP_LEFT: {
                refP = this._points[EN_AnchorName.BTM_RIGHT];
                originRef = this._originPoints[EN_AnchorName.BTM_RIGHT];
                break;
            }
            case EN_AnchorName.TOP_RIGHT: {
                refP = this._points[EN_AnchorName.BTM_LEFT];
                originRef = this._originPoints[EN_AnchorName.BTM_LEFT];
                break;
            }
            case EN_AnchorName.BTM_LEFT: {
                refP = this._points[EN_AnchorName.TOP_RIGHT];
                originRef = this._originPoints[EN_AnchorName.TOP_RIGHT];
                break;
            }
            case EN_AnchorName.BTM_RIGHT: {
                refP = this._points[EN_AnchorName.TOP_LEFT];
                originRef = this._originPoints[EN_AnchorName.TOP_LEFT];
                break;
            }
        }

        const deltaHypotenuse = refP.distanceTo(pos) - hypotenuse;
        const scale = (hypotenuse + deltaHypotenuse) / hypotenuse;
        transform.translate(originRef.x, originRef.y);
        transform.scale(scale, scale);
        transform.translate(-originRef.x, -originRef.y);

        return transform;
    }

    /**
     * 0-------------1
     * |             |
     * |             |
     * |             |
     * 3-------------2
     */
    private _draw() {
        const grep = this.createGRep();
        const linePoints = [...this._points, this._points[0]];
        for (let i = 0; i < linePoints.length - 1; i += 1) {
            const p1 = linePoints[i];
            const p2 = linePoints[i + 1];
            const gline = new GLine({ points: [p1.x, p1.y, p2.x, p2.y] });
            gline.setStyle(CoreConfig.resizeGizmoLineStyle);
            grep.addNode(gline);

            if (i < this._points.length) {
                const gCircle = new GCircle({
                    radius: CoreConfig.resizeGizmoPointSize,
                    x: p1.x,
                    y: p1.y
                });
                gCircle.setStyle(CoreConfig.resizeGizmoPointStyle);
                grep.addNode(gCircle);
            }
        }
        this._grep = grep;
    }

    public onMouseMove(event: I_MouseEvent) {
        if (this._dragStart) return true;
        const pickIndex = this._posPickAnchor(event.pos);
        if (pickIndex !== undefined) {
            this._hoverIndex = pickIndex;
            if (pickIndex === EN_AnchorName.TOP_LEFT || pickIndex === EN_AnchorName.BTM_RIGHT) {
                this._canvas.setMouseCursor(EN_MouseCursor.NWSE_RESIZE);
            } else {
                this._canvas.setMouseCursor(EN_MouseCursor.NESW_RESIZE);
            }
        } else {
            this._hoverIndex = -1;
            this._canvas.setMouseCursor(EN_MouseCursor.DEFAULT);
        }
        return false;
    }

    public onDragStart(event: I_MouseEvent) {
        if (this._hoverIndex === -1) return false;
        this._dragStart = true;
        this._dragMovePos = event.pos;
        this.dragStartSignal.dispatch();
        return false;
    }

    public onDragMove(event: I_MouseEvent) {
        if (!this._dragStart) return false;

        const transform = this._getTransformFromPos(event.pos);
        this._dragMovePos = event.pos;

        if (transform?.hasChanged()) this.dragMoveSignal.dispatch(transform);

        return false;
    }

    public onDragEnd(_event: I_MouseEvent) {
        if (this._dragStart) {
            this._dragStart = false;
            this._dragMovePos = undefined;
            this.dragEndSignal.dispatch();
        }
        return false;
    }

    public onRender(): T_GizmoRenderData {
        return {
            grep: this._grep,
            gizmoId: this.id
        };
    }
}