import { CoreConfig, Element, GLine, GRep, injectDB, I_Vec2 } from "@gene/core";
import { DBPipe } from "../db/db_pipe";

@injectDB('b29ef3a2-a45c-4272-ac69-584fdd8d6955', DBPipe)
export class PipeElement extends Element<DBPipe> {
    public get points() {
        return this.db.points;
    }

    public set points(v: I_Vec2[]) {
        this.db.points = v;
    }
    public markGRepDirty(): void {
        const grep = new GRep();

        const points = this.points.flatMap(p => { return [p.x, p.y]; });
        const line1 = new GLine({ points });
        const line2 = new GLine({ points });
        line1.setStyle(CoreConfig.pipeOuterStyle);
        line2.setStyle(CoreConfig.pipeInnerStyle);
        grep.addNode(line1);
        grep.addNode(line2);
        this.db.C_GRep = grep;
    }
}