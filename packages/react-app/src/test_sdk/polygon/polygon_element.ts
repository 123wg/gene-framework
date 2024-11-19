import { CoreConfig, Element, GRegPolygon, GRep, injectDB } from "@gene/core";
import { DBPolygon } from "./db_polygon";

@injectDB('f0145df9-0e94-4d2d-9613-a16da94ff600', DBPolygon)
export class PolygonElement extends Element<DBPolygon> {
    public get x() {
        return this.db.x;
    }

    public get y() {
        return this.db.y;
    }

    public get sides() {
        return this.db.sides;
    }

    public get radius() {
        return this.db.radius;
    }

    public set x(v: number) {
        this.db.x = v;
    }

    public set y(v: number) {
        this.db.y = v;
    }

    public set sides(v: number) {
        this.db.sides = v;
    }

    public set radius(v: number) {
        this.db.radius = v;
    }

    public markGRepDirty(): void {
        const grep = new GRep();
        const gPolygon = new GRegPolygon({
            sides: this.sides,
            radius: this.radius,
            x: this.x,
            y: this.y
        });
        gPolygon.setStyle(CoreConfig.defaultLineEleStyle);
        grep.addNode(gPolygon);
        this.db.C_GRep = grep;
    }
}