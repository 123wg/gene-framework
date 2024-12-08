import { app, Cmd, PickLineAction, registerCmd, T_PickPointResult } from "@gene/platform";
import { EN_AppCmd } from "./cmd_id";
import { CreateRectRequest } from "@gene/editor-sdk";
import { CoreConfig, GRect, GRep, MathUtil } from "@gene/core";

/**
 * 绘制矩形命令
 */
@registerCmd(EN_AppCmd.DRAW_RECT_CMD)
export class DrawRectCmd extends Cmd {
    public executeImmediately = false;

    public async execute() {
        app.selection.clear();
        // this._updateView();

        const action = new PickLineAction({
            executeDefaultDraw: false,
            onLineUpdate: (p1, p2) => {
                if (p2) {
                    this._drawPreviewRect(p1, p2);
                }
            }
        });

        const result = await this.runAction(action);
        if (result.isSuccess) {
            const p1 = result.data[0].point;
            const p2 = result.data[1].point;
            app.requestMgr.startSession();
            const rect = MathUtil.createRectByPoints([p1, p2]);
            const req = app.requestMgr.createRequest(CreateRectRequest, rect.x, rect.y, rect.width, rect.height);
            app.requestMgr.commitRequest(req);
            app.requestMgr.commitSession();
        }
        this.cancel();
        return;
    }


    private _drawPreviewRect(res1?: T_PickPointResult, res2?: T_PickPointResult) {
        const p1 = res1?.point;
        const p2 = res2?.point;
        if (!p1 || !p2) return;
        this.clearTmp();
        const rect = MathUtil.createRectByPoints([p1, p2]);
        const grep = new GRep();
        const gRect = new GRect(rect);
        gRect.setStyle(CoreConfig.defaultLineEleStyle);
        grep.addNode(gRect);
        this.drawTmpGRep(grep);
        this._updateView();
    }
}