import { Element } from "@gene/core";
import { GizmoBase } from "./gizmo_base";

/**
 * gizmo工厂接口
 */
export interface I_GizmoFactory {
    clear(): void
    createGizmos(elements: Element[]): GizmoBase[]
}