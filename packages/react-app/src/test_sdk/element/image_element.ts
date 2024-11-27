import { AssetsMgr, GImage, GRep, injectDB } from "@gene/core";
import { DBImage } from "../db/db_image";
import { TransformElement } from "./transform_element";

@injectDB('26976b2c-b696-400a-93db-71e4daecd6d5', DBImage)
export class ImageElement extends TransformElement<DBImage> {
    public get src() {
        return this.db.src;
    }

    public set src(v: string) {
        this.db.src = v;
    }
    public get width() {
        return this.db.width;
    }

    public set width(v: number) {
        this.db.width = v;
    }

    public get height() {
        return this.db.height;
    }

    public set height(v: number) {
        this.db.height = v;
    }

    public markGRepDirty(): void {
        // 重新计算x,y的位置
        const info = AssetsMgr.instance().getImageEnsure(this.src);
        const grep = new GRep();
        const tAttrs = this.getTransformAttrs();
        const gImage = new GImage({
            x: tAttrs.x + this.width / 2,
            y: tAttrs.y + this.height / 2,
            offsetX: this.width / 2,
            offsetY: this.height / 2,
            width: this.width,
            height: this.height,
            image: info.imageObj,
            rotation: tAttrs.rotation,
            scaleX: tAttrs.scaleX,
            scaleY: tAttrs.scaleY
        });
        grep.addNode(gImage);
        this.db.C_GRep = grep;
    }
}
