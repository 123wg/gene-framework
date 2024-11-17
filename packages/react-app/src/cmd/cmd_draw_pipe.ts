import { Cmd, PickPointAction, registerCmd } from "@gene/platform";
import { EN_AppCmd } from "./cmd_id";
import { GCircle, GRep } from "@gene/core";

@registerCmd(EN_AppCmd.DRAW_PIPE_CMD)
export class DrawpipeCmd extends Cmd {
    public executeImmediately = false;

    public async execute() {
        const grep = new GRep();
        while (true) {
            const action = new PickPointAction();
            const result = await this.runAction(action);
            const p = result.data?.point;
            if (p) {
                const circle = new GCircle({ ...p, radius: 5 });
                circle.setStyle({ stroke: 'red' });
                grep.addNode(circle);
                this.clearTmp();
                this.drawTmpGRep(grep);
                this._updateView();
            } else {
                this.cancel();
                return;
            }
        }
    }
}