import { CoreConfig, GCircle, GRep, injectDB, TransformElement } from "@gene/core";
import { DBCircle } from "../db/db_circle";

@injectDB('352be101-1c27-4ab5-8396-cafb067e0a7a', DBCircle)
export class CircleElement extends TransformElement<DBCircle> {
    public get radius() {
        return this.db.radius;
    }

    public set radius(v: number) {
        this.db.radius = v;
    }

    public markGRepDirty(): void {
        const tAttrs = this.getTransformAttrs();
        const grep = new GRep(tAttrs);
        const gCircle = new GCircle({
            radius: this.radius
        });
        gCircle.setStyle(CoreConfig.defaultLineEleStyle);
        grep.addNode(gCircle);
        this.db.C_GRep = grep;
    }
}