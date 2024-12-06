import { Vec2 } from "@gene/core";
import { RotateGizmo } from "./rotate_gizmo";

export type T_RotateGizmoGeo = {
    /**旋转指示线的起点终点*/
    start: Vec2,
    end: Vec2,
    center: Vec2
    originCenter: Vec2
    flip: boolean
    /**自身旋转角度*/
    oldRotation: number

}

export interface I_RotateGizmoHandler {
    setGizmo(gizmo: RotateGizmo): void;
    getGeoms(): T_RotateGizmoGeo;
}