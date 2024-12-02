import { CoreConfig, GRegPolygon, GRep, injectDB, TransformElement } from "@gene/core";
import { DBPolygon } from "../db/db_polygon";

@injectDB('f0145df9-0e94-4d2d-9613-a16da94ff600', DBPolygon)
export class PolygonElement extends TransformElement<DBPolygon> {

    public get sides() {
        return this.db.sides;
    }

    public get radius() {
        return this.db.radius;
    }

    public set sides(v: number) {
        this.db.sides = v;
    }

    public set radius(v: number) {
        this.db.radius = v;
    }

    public markGRepDirty(): void {
        const tAttrs = this.getTransformAttrs();
        const grep = new GRep(tAttrs);
        const gPolygon = new GRegPolygon({
            sides: this.sides,
            radius: this.radius
        });
        gPolygon.setStyle(CoreConfig.defaultLineEleStyle);
        grep.addNode(gPolygon);
        this.db.C_GRep = grep;
    }
}