import { CoreConfig, GRect, GRep, injectDB, TransformElement } from "@gene/core";
import { DBRect } from "../db/db_rect";

/**
 * 矩形图元
 */
@injectDB('a0cfaabe-eddd-4372-ba90-01edc31617d2', DBRect)
export class RectElement extends TransformElement<DBRect> {
    public get width() {
        return this.db.width;
    }

    public set width(w: number) {
        this.db.width = w;
    }

    public get height() {
        return this.db.height;
    }

    public set height(h: number) {
        this.db.height = h;
    }

    public markGRepDirty(): void {
        const tAttrs = this.getTransformAttrs();
        const grep = new GRep(tAttrs);

        const gRect = new GRect({
            width: this.width,
            height: this.height
        });
        gRect.setStyle(CoreConfig.defaultLineEleStyle);
        grep.addNode(grep);
        this.db.C_GRep = grep;
    }
}