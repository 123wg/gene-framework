import { Element, GRect, GRep, TmpElementPainter } from "@gene/core";
import { app, GizmoFactory } from "@gene/platform";
import { GizmoBase } from "@gene/render";
import { ImageElement } from "./image/image_element";
import { CircleElement } from "./circle/circle_element";

export class AppGizmoFactory extends GizmoFactory {
    public createGizmos(elements: Element[]): GizmoBase[] {
        const gizmos: GizmoBase[] = [];
        if (elements.length === 1) {
            const element = elements[0];
            if (element.isLike(ImageElement) || element.isLike(CircleElement)) {
                // console.log(element.getGRep().getClientRect());
                const tmp = new TmpElementPainter(app.doc);
                const grep = new GRep();
                const gRect = new GRect(element.getGRep().getClientRect());
                gRect.setStyle({ stroke: 'red', strokeWidth: 10 });

                grep.addNode(gRect);
                tmp.drawTmpGRep(grep);
                app.doc.updateView();

                // gizmos.push();
            }
        }

        return gizmos;
    }
}