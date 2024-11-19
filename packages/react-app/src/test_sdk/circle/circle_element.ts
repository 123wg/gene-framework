import { CoreConfig, Element, GCircle, GRep, injectDB } from "@gene/core";
import { DBCircle } from "./db_circle";

@injectDB('352be101-1c27-4ab5-8396-cafb067e0a7a', DBCircle)
export class CircleElement extends Element<DBCircle> {
    public get radius() {
        return this.db.radius;
    }

    public set radius(v: number) {
        this.db.radius = v;
    }

    public get x() {
        return this.db.x;
    }

    public get y() {
        return this.db.y;
    }

    public set x(v: number) {
        this.db.x = v;
    }

    public set y(v: number) {
        this.db.y = v;
    }

    public markGRepDirty(): void {
        const grep = new GRep();
        const gCircle = new GCircle({
            radius: this.radius,
            x: this.x,
            y: this.y
        });
        gCircle.setStyle(CoreConfig.defaultLineEleStyle);
        grep.addNode(gCircle);
        this.db.C_GRep = grep;
    }
}