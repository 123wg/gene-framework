import type { GNode, T_Rect, T_XY } from "@gene/core";
import { EN_MouseCursor, I_MouseEvent, T_GizmoRenderData } from "../../type_define/type_define";
import { GizmoBase } from "../gizmo_base";
import { registerGizmo } from "../gizmo_decorator";
import { EN_GizmoId } from "../gizmo_id";
import { CoreConfig, GCircle, GRect, GRep } from "@gene/core";

/**
 * 改变大小
 */
@registerGizmo(EN_GizmoId.RESIZE_GIZMO)
export class ResizeGizmo extends GizmoBase {
    private _rect: T_Rect;

    private _grep: GRep;

    private _anchorPoints: Array<T_XY> = [];

    /**角点大小*/
    public anchorSize = 4;

    /**是否按比例缩放*/
    public keepRatio = true;

    /**是否按中心点缩放*/
    public centerScale = false;

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

    private _draw() {
    }

    // public onMouseMove(event: I_MouseEvent): boolean {
    //     const gnode = this._canvas.pickGizmo(event.pos);
    //     if (gnode) {
    //         if (gnode === this._tlAnchor || gnode === this._brAnchor) {
    //             this._canvas.setMouseCursor(EN_MouseCursor.NWSE_RESIZE);
    //         } else if (gnode === this._trAnchor || gnode === this._blAnchor) {
    //             this._canvas.setMouseCursor(EN_MouseCursor.NESW_RESIZE);
    //         }
    //         this._hoverAnchor = gnode;
    //     } else {
    //         this._canvas.setMouseCursor(EN_MouseCursor.DEFAULT);
    //         this._hoverAnchor = undefined;
    //     }
    //     return false;
    // }

    // public onDragStart(event: I_MouseEvent): boolean {
    //     if (!this._hoverAnchor) return false;
    //     this._dragStartPos = event.pos;
    //     return false;
    // }

    // public onDragMove(_event: I_MouseEvent): boolean {
    //     if (!this._hoverAnchor) return false;
    //     if (this._hoverAnchor === this._trAnchor) {
    //         console.log('111111');
    //     }
    //     return false;
    // }

    // public onDragEnd(_event: I_MouseEvent): boolean {
    //     if (!this._hoverAnchor) return false;
    //     return false;
    // }


    // public onMouseUp(_event: I_MouseEvent): boolean {
    //     this._hoverAnchor = undefined;
    //     return false;
    // }

    public onRender(): T_GizmoRenderData {
        return {
            grep: this._grep,
            gizmoId: this.id
        };
    }
}