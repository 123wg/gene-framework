import type { T_Rect } from "@gene/core/src/type_define/type_define";
import { T_GizmoRenderData } from "../../type_define/type_define";
import { GizmoBase } from "../gizmo_base";
import { registerGizmo } from "../gizmo_decorator";
import { EN_GizmoId } from "../gizmo_id";
import { GRect, GRep } from "@gene/core";

/**
 * 改变大小
 */
@registerGizmo(EN_GizmoId.RESIZE_GIZMO)
export class ResizeGizmo extends GizmoBase {
    private _rect: T_Rect;

    private _grep: GRep;
    constructor(rect: T_Rect) {
        super();
        this._rect = rect;
    }
    public onInit(): void {
        this._grep = new GRep();
        const rect = new GRect(this._rect);
        rect.setStyle({ stroke: 'red' });
        this._grep.addNode(rect);
    }
    public onChange(): void {
        throw new Error("Method not implemented.");
    }
    public onRender(): T_GizmoRenderData {
        return {
            grep: this._grep,
            gizmoId: this.id
        };
    }
}