import { AssetsMgr, Element, GImage, GRep, injectDB } from "@gene/core";
import { DBImage } from "./db_image";

@injectDB('26976b2c-b696-400a-93db-71e4daecd6d5', DBImage)
export class ImageElement extends Element<DBImage> {
    public get src() {
        return this.db.src;
    }

    public set src(v: string) {
        this.db.src = v;
    }

    public get x() {
        return this.db.x;
    }

    public set x(v: number) {
        this.db.x = v;
    }

    public get y() {
        return this.db.y;
    }

    public set y(v: number) {
        this.db.y = v;
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
        const info = AssetsMgr.instance().getImageEnsure(this.src);
        const grep = new GRep();
        const gImage = new GImage({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            image: info.imageObj
        });
        grep.addNode(gImage);
        this.db.C_GRep = grep;
    }
}
