import { Element, } from "@gene/core";
import { GizmoFactory } from "@gene/platform";
import { GizmoBase, ResizeGizmo } from "@gene/render";
import { ImageElement } from "./image/image_element";
import { CircleElement } from "./circle/circle_element";

export class AppGizmoFactory extends GizmoFactory {
    public createGizmos(elements: Element[]): GizmoBase[] {
        const gizmos: GizmoBase[] = [];
        if (elements.length === 1) {
            const element = elements[0];
            if (element.isLike(ImageElement) || element.isLike(CircleElement)) {
                const rect = element.getGRep().getClientRect();
                const gizmo = new ResizeGizmo(rect);
                gizmos.push(gizmo);
                // gizmo只和渲染有关,所以理论上可以都放在render中,需要考虑如何和业务结合起来
                // const tmp = new TmpElementPainter(app.doc);
                // const grep = new GRep();
                // const rect = element.getGRep().getClientRect();
                // const gRect = new GRect(rect);
                // gRect.setStyle({ stroke: CoreConfig.previewPointStroke, strokeWidth: 1 });

                // grep.addNode(gRect);
                // tmp.drawTmpGRep(grep);
                // app.doc.updateView();
            }
        }

        return gizmos;
    }
}