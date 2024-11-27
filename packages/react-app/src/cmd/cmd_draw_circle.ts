import { app, Cmd, PickLineAction, registerCmd, T_PickPointResult } from "@gene/platform";
import { EN_AppCmd } from "./cmd_id";
import { CoreConfig, GCircle, GRep, MathUtil } from "@gene/core";
import { CreateCircleRequest } from "../test_sdk/request/create_circle_request";

/**
 * 绘制圆形命令
 */
@registerCmd(EN_AppCmd.DRAW_CIRCLE_CMD)
export class DrawCircleCmd extends Cmd {
    public executeImmediately = false;

    public async execute() {
        const action = new PickLineAction({
            executeDefaultDraw: false,
            onLineUpdate: (p1, p2) => {
                if (p2) {
                    this._drawPreviewCircle(p1, p2);
                }
            }
        });
        const result = await this.runAction(action);
        if (result.isSuccess) {
            const p1 = result.data[0].point;
            const p2 = result.data[1].point;
            app.requestMgr.startSession();
            const distance = MathUtil.ppDistance(p1, p2);
            const req = app.requestMgr.createRequest(CreateCircleRequest, distance, p1.x, p1.y);
            app.requestMgr.commitRequest(req);
            app.requestMgr.commitSession();
        }
        this.cancel();
        return;
    }


    private _drawPreviewCircle(result1?: T_PickPointResult, result2?: T_PickPointResult) {
        const p1 = result1?.point;
        const p2 = result2?.point;
        if (!p1 || !p2) return;
        this.clearTmp();
        const distance = MathUtil.ppDistance(p1, p2);
        const grep = new GRep();
        const gCircle = new GCircle({
            radius: distance,
            x: p1.x,
            y: p1.y
        });
        gCircle.setStyle(CoreConfig.defaultLineEleStyle);
        grep.addNode(gCircle);

        const gLine = new GCircle({
            radius: distance,
            x: p1.x,
            y: p1.y
        });
        gLine.setStyle(CoreConfig.previewDashLineStyle);
        grep.addNode(gLine);
        this.drawTmpGRep(grep);
        this._updateView();
    }
}