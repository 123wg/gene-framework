import type { T_Rect, I_Vec2, Vec2 } from "@gene/core";
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
    private _dragStartPos: I_Vec2 | undefined;

    public dragStartSignal = new Signal<this, undefined>(this);
    public dragMoveSignal = new Signal<this, T_Rect>(this);
    public dragEndSignal = new Signal<this, undefined>(this);


    constructor(handler: I_ResizeGizmoHandler) {
        super();
        this._handler = handler;
        this._points = this._handler.getGeoms();
    }

    public onInit(): void {
        this._draw();
    }

    public onChange(): void {
        this._points = this._handler.getGeoms();
        this._draw();
    }

    /**
     * 获取拖拽点的实际坐标
     * 排除拖拽点的偏移影响
     */
    private _getDragPointPos(pos: I_Vec2) {
        const point = this._points[this._hoverIndex];
        return {
            x: pos.x - (this._dragStartPos!.x - point.x),
            y: pos.y - (this._dragStartPos!.y - point.y)
        };
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
     * 根据位置计算resize返回信息
     */
    private _getTransformFromPos(pos: I_Vec2): T_Rect | undefined {
        const tPos = this._getDragPointPos(pos);
        const hypotenuse = this._points[0].distanceTo(this._points[2]);
        const width = this._points[0].distanceTo(this._points[1]);
        const height = this._points[1].distanceTo(this._points[2]);
        const sin = width / hypotenuse;
        const cos = height / hypotenuse;
        let result: T_Rect = { x: -1, y: -1, width: -1, height: -1 };
        switch (this._hoverIndex) {
            case EN_AnchorName.TOP_LEFT: {
                const refP = this._points[EN_AnchorName.BTM_RIGHT];
                const newDis = refP.distanceTo(tPos);
                result = {
                    x: tPos.x,
                    y: tPos.y,
                    width: newDis * cos,
                    height: newDis * sin
                };
                break;
            }
            case EN_AnchorName.TOP_RIGHT: {
                const refP = this._points[EN_AnchorName.BTM_LEFT];
                const newDis = refP.distanceTo(tPos);
                console.log('放大倍数');

                console.log(newDis / hypotenuse);

                result = {
                    x: refP.x,
                    y: refP.y - newDis * sin,
                    width: newDis * cos,
                    height: newDis * sin
                };
                break;
            }
            case EN_AnchorName.BTM_LEFT: {
                const refP = this._points[EN_AnchorName.TOP_RIGHT];
                const newDis = refP.distanceTo(tPos);
                result = {
                    x: tPos.x,
                    y: refP.y,
                    width: newDis * cos,
                    height: newDis * sin
                };
                break;
            }
            case EN_AnchorName.BTM_RIGHT: {
                const refP = this._points[EN_AnchorName.TOP_LEFT];
                const newDis = refP.distanceTo(tPos);
                result = {
                    x: refP.x,
                    y: refP.y,
                    width: newDis * cos,
                    height: newDis * sin
                };
                break;
            }
        }
        if (result.width < 0 && result.height < 0) return;
        return result;
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
        this._dragStartPos = event.pos;
        return false;
    }

    public onDragMove(event: I_MouseEvent) {
        if (!this._dragStart) return false;
        const result = this._getTransformFromPos(event.pos);
        if (result) this.dragMoveSignal.dispatch(result);

        return false;
    }

    public onDragEnd(_event: I_MouseEvent) {
        if (this._dragStart) {
            this._dragStart = false;
            this._dragStartPos = undefined;
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