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

    public markGRepDirty(): void {
        const imageObj = AssetsMgr.instance().getImageEnsure(this.src);
        const grep = new GRep();
        const gImage = new GImage({
            x: 100,
            y: 100,
            width: 200,
            height: 200,
            image: imageObj
        });
        grep.addNode(gImage);
        this.db.C_GRep = grep;
    }
}
