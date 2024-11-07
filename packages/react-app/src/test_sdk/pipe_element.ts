import { Element, GLine, GRep, injectDB, T_XY } from "@gene/core";
import { DBPipe } from "./db_pipe";

@injectDB('b29ef3a2-a45c-4272-ac69-584fdd8d6955', DBPipe)
export class PipeElement extends Element<DBPipe> {
    public get outerStart() {
        return this.db.outerStart;
    }

    public set outerStart(v: T_XY) {
        this.db.outerStart = v;
    }

    public get outerEnd() {
        return this.db.outerEnd;
    }

    public set outerEnd(v: T_XY) {
        this.db.outerEnd = v;
    }

    public get innerStart() {
        return this.db.innerStart;
    }

    public set innerStart(v: T_XY) {
        this.db.innerStart = v;
    }

    public get innerEnd() {
        return this.db.innerEnd;
    }

    public set innerEnd(v: T_XY) {
        this.db.innerEnd = v;
    }

    public markGRepDirty(): void {
        const grep = new GRep();
        const line1 = new GLine(this.outerStart, this.outerEnd);
        const line2 = new GLine(this.innerStart, this.innerEnd);
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