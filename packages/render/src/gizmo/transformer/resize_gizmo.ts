import type { T_Rect } from "@gene/core/src/type_define/type_define";
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

    /**角点大小*/
    private _anchorSize = 4;

    /**所有角点*/
    private _allAnchors: GCircle[] = [];

    /**左上*/
    private _tlAnchor: GCircle;
    /**右上*/
    private _trAnchor: GCircle;
    /**左下*/
    private _blAnchor: GCircle;
    /**右下*/
    private _brAnchor: GCircle;


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
        const grep = this.createGRep();

        const back = new GRect(this._rect);
        back.setStyle(CoreConfig.resizeGizmoBgStyle);
        grep.addNode(back);

        const topLeftP = {
            x: this._rect.x,
            y: this._rect.y
        };
        const topRightP = {
            x: this._rect.x + this._rect.width,
            y: this._rect.y
        };
        const btmLeftP = {
            x: this._rect.x,
            y: this._rect.y + this._rect.height
        };
        const btmRightP = {
            x: this._rect.x + this._rect.width,
            y: this._rect.y + this._rect.height
        };
        const tl = new GCircle({
            radius: this._anchorSize,
            ...topLeftP
        });
        const tr = new GCircle({
            radius: this._anchorSize,
            ...topRightP
        });
        const bl = new GCircle({
            radius: this._anchorSize,
            ...btmLeftP
        });
        const br = new GCircle({
            radius: this._anchorSize,
            ...btmRightP
        });
        tl.setStyle(CoreConfig.resizeGizmoPointStyle);
        tr.setStyle(CoreConfig.resizeGizmoPointStyle);
        bl.setStyle(CoreConfig.resizeGizmoPointStyle);
        br.setStyle(CoreConfig.resizeGizmoPointStyle);

        grep.addNode(tl);
        grep.addNode(tr);
        grep.addNode(bl);
        grep.addNode(br);

        this._tlAnchor = tl;
        this._trAnchor = tr;
        this._blAnchor = bl;
        this._brAnchor = br;
        this._allAnchors = [tl, tr, bl, br];

        this._grep = grep;
    }

    public onMouseMove(event: I_MouseEvent): boolean {
        const gnode = this._canvas.pickGizmo(event.pos);
        if (gnode) {
            if (gnode === this._tlAnchor || gnode === this._brAnchor) {
                this._canvas.setMouseCursor(EN_MouseCursor.NWSE_RESIZE);
            } else if (gnode === this._trAnchor || gnode === this._blAnchor) {
                this._canvas.setMouseCursor(EN_MouseCursor.NESW_RESIZE);
            }
        } else {
            this._canvas.setMouseCursor(EN_MouseCursor.DEFAULT);
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