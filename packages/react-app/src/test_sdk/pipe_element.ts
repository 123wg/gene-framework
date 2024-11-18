import { CoreConfig, Element, GLine, GRep, injectDB, T_XY } from "@gene/core";
import { DBPipe } from "./db_pipe";

@injectDB('b29ef3a2-a45c-4272-ac69-584fdd8d6955', DBPipe)
export class PipeElement extends Element<DBPipe> {
    public get points() {
        return this.db.points;
    }

    public set points(v: T_XY[]) {
        this.db.points = v;
    }
    public markGRepDirty(): void {
        const grep = new GRep();

        const points = this.points.flatMap(p => { return [p.x, p.y]; });
        const line1 = new GLine({ points });
        const line2 = new GLine({ points });
        line1.setStyle({
            stroke: CoreConfig.pipeOuterStroke,
            strokeWidth: CoreConfig.pipeOuterWidth
        });
        line2.setStyle({
            stroke: CoreConfig.pipeInnerStroke,
            strokeWidth: CoreConfig.pipeInnerWidth,
            dash: CoreConfig.pipeInnerDash
        });
        grep.addNode(line1);
        grep.addNode(line2);
        this.db.C_GRep = grep;
    }
}