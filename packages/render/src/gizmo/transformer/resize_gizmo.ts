import type { T_Rect, T_XY } from "@gene/core";
import { EN_AnchorName, EN_MouseCursor, I_MouseEvent, T_GizmoRenderData, T_ResizeTransform } from "../../type_define/type_define";
import { GizmoBase } from "../gizmo_base";
import { registerGizmo } from "../gizmo_decorator";
import { EN_GizmoId } from "../gizmo_id";
import { CoreConfig, GCircle, GRect, GRep, MathUtil, Signal } from "@gene/core";


/**
 * 改变大小
 */
@registerGizmo(EN_GizmoId.RESIZE_GIZMO)
export class ResizeGizmo extends GizmoBase {
    private _rect: T_Rect;
    private _grep: GRep;

    /**角点集合*/
    private _anchorPoints: Array<T_XY> = [];

    /**是否按比例缩放*/
    public keepRatio = true;

    /**是否按中心点缩放*/
    public centerScale = false;

    /**当前hover的index*/
    public _hoverIndex = -1;

    /**是否开始拖拽*/
    private _dragStart = false;

    /**拖拽开始点坐标*/
    private _dragStartPos: T_XY | undefined;

    public dragStartSignal = new Signal<this, undefined>(this);
    public dragMoveSignal = new Signal<this, undefined>(this);
    public dragEndSignal = new Signal<this, undefined>(this);

    constructor(rect: T_Rect) {
        super();
        this._rect = rect;
    }
    public onInit(): void {
        this._draw();
    }

    public onChange(): void {
        throw new Error("Method not implemented.");
    }

    /**
     * 获取矩形中心点
     */
    private _getRectCenter() {
        return {
            x: this._rect.x + this._rect.width / 2,
            y: this._rect.y + this._rect.height / 2
        };
    }

    /**
     * 获取拖拽点的实际坐标
     * 排除拖拽点的偏移影响
     */
    private _getDragPointPos(pos: T_XY) {
        const point = this._anchorPoints[this._hoverIndex];
        return {
            x: pos.x - (this._dragStartPos!.x - point.x),
            y: pos.y - (this._dragStartPos!.y - point.y)
        };
    }

    /**
     * 矩形转角点
     */
    private _rectToPoints() {
        const p0: T_XY = {
            x: this._rect.x,
            y: this._rect.y
        };
        const p1: T_XY = {
            x: p0.x + this._rect.width,
            y: p0.y
        };
        const p2: T_XY = {
            x: p1.x,
            y: p1.y + this._rect.height
        };
        const p3: T_XY = {
            x: p0.x,
            y: p2.y
        };
        this._anchorPoints = [p0, p1, p2, p3];
    }

    /**
     * 判断是否pick中角点
     * @returns 角点下标
     */
    private _posPickAnchor(pos: T_XY) {
        const index = this._anchorPoints.findIndex(_ => MathUtil.ppDistance(pos, _) < CoreConfig.resizeGizmoPointSize * 1.2);
        return index > -1 ? index : undefined;
    }


    /**
     * 根据位置计算resize返回信息
     */
    private _getTransformFromPos(pos: T_XY): T_ResizeTransform {
        const tPos = this._getDragPointPos(pos);
        const hypotenuse = Math.sqrt(Math.pow(this._rect.width, 2) + Math.pow(this._rect.height, 2));

        switch (this._hoverIndex) {
            case EN_AnchorName.TOP_LEFT: {
                const refP = this._anchorPoints[EN_AnchorName.BTM_RIGHT];
                break;
            }
            case EN_AnchorName.TOP_RIGHT: {
                const refP = this._anchorPoints[EN_AnchorName.BTM_LEFT];
                break;
            }
            case EN_AnchorName.BTM_LEFT: {
                const refP = this._anchorPoints[EN_AnchorName.TOP_RIGHT];
                break;
            }
            case EN_AnchorName.BTM_RIGHT: {
                const refP = this._anchorPoints[EN_AnchorName.BTM_RIGHT];
                break;
            }
        }
        return {};
    }

    /**
     * 0-------------1
     * |             |
     * |             |
     * |             |
     * 3-------------2
     */
    private _draw() {
        this._rectToPoints();
        const grep = this.createGRep();

        const back = new GRect(this._rect);
        back.setStyle(CoreConfig.resizeGizmoBgStyle);
        grep.addNode(back);

        this._anchorPoints.forEach(point => {
            const gCircle = new GCircle({ radius: CoreConfig.resizeGizmoPointSize, ...point });
            gCircle.setStyle(CoreConfig.resizeGizmoPointStyle);
            grep.addNode(gCircle);
        });
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
        const a: T_ResizeTransform = this._getTransformFromPos(event.pos);
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