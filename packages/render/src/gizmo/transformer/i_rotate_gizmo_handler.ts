import { Vec2 } from "@gene/core";
import { RotateGizmo } from "./rotate_gizmo";

export type T_RotateGizmoGeoms = {
    start: Vec2,
    end: Vec2,
    center: Vec2
    originCenter: Vec2
    flip: boolean

}

export interface I_RotateGizmoHandler {
    setGizmo(gizmo: RotateGizmo): void;
    getGeoms(): T_RotateGizmoGeoms;
}