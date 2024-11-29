import { Element, } from "@gene/core";
import { GizmoFactory } from "@gene/platform";
import { GizmoBase, ResizeGizmo } from "@gene/render";
import { ResizeGizmoHandler } from "./resize_gizmo_handler";
import { TransformElement } from "@gene/editor-sdk";

export class AppGizmoFactory extends GizmoFactory {
    public createGizmos(elements: Element[]): GizmoBase[] {
        const gizmos: GizmoBase[] = [];
        if (elements.length === 1) {
            const element = elements[0];
            if (element.isLike(TransformElement)) {
                const handler = new ResizeGizmoHandler(element);
                const gizmo = new ResizeGizmo(handler);
                gizmos.push(gizmo);
            }
        }

        return gizmos;
    }
}