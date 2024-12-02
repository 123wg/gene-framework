import { Element, } from "@gene/core";
import { GizmoFactory } from "@gene/platform";
import { GizmoBase, ResizeGizmo, RotateGizmo } from "@gene/render";
import { ResizeGizmoHandler } from "./resize_gizmo_handler";
import { TransformElement } from "@gene/editor-sdk";
import { RotateGizmoHandler } from "./rotate_gizmo_handler";

export class AppGizmoFactory extends GizmoFactory {
    public createGizmos(elements: Element[]): GizmoBase[] {
        const gizmos: GizmoBase[] = [];
        if (elements.length === 1) {
            const element = elements[0];
            if (element.isLike(TransformElement)) {
                const resizeHandler = new ResizeGizmoHandler(element);
                const resizeGizmo = new ResizeGizmo(resizeHandler);

                const rotateHandler = new RotateGizmoHandler(element);
                const rotateGizmo = new RotateGizmo(rotateHandler);


                gizmos.push(resizeGizmo, rotateGizmo);
            }
        }

        return gizmos;
    }
}