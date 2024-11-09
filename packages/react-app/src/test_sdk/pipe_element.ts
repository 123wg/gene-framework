import { Element, GLine, GRep, injectDB, T_XY } from "@gene/core";
import { DBPipe } from "./db_pipe";

@injectDB('b29ef3a2-a45c-4272-ac69-584fdd8d6955', DBPipe)
export class PipeElement extends Element<DBPipe> {
    public get start() {
        return this.db.start;
    }

    public set start(v: T_XY) {
        this.db.start = v;
    }

    public get end() {
        return this.db.end;
    }

    public set end(v: T_XY) {
        this.db.end = v;
    }
    public markGRepDirty(): void {
        const grep = new GRep();

        const points = [this.start.x, this.start.y, this.end.x, this.end.y];
        const line1 = new GLine({ points });
        const line2 = new GLine({ points });
        line1.setStyle({
            stroke: '#4f4fd9',
            strokeWidth: 10
        });
        line2.setStyle({
            stroke: '#7373d9',
            strokeWidth: 5,
            dash: [19, 8]
        });
        grep.addNode(line1);
        grep.addNode(line2);
        this.db.C_GRep = grep;
    }
}