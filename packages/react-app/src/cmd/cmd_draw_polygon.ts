import { app, Cmd, PickLineAction, registerCmd, T_PickPointResult } from "@gene/platform";
import { EN_AppCmd } from "./cmd_id";
import { CoreConfig, GCircle, GRegPolygon, GRep, MathUtil } from "@gene/core";
import { CreatePolygonRequest } from "../test_sdk/polygon/create_polygon_request";

/**
 * 绘制正多边形命令
 */
@registerCmd(EN_AppCmd.DRAW_REG_POLYGON)
export class DrawPolygonCmd extends Cmd {
    public executeImmediately = false;

    public async execute() {
        const action = new PickLineAction({
            executeDefaultDraw: false,
            onLineUpdate: (first, second) => {
                if (second) {
                    this._drawPreviewPolygon(first, second);
                }
            },
        });
        const result = await this.runAction(action);
        if (result.isSuccess) {
            const p1 = result.data[0].point;
            const p2 = result.data[1].point;
            app.requestMgr.startSession();
            const distance = MathUtil.ppDistance(p1, p2);
            const req = app.requestMgr.createRequest(CreatePolygonRequest, {
                radius: distance,
                sides: 5,
                x: p1.x,
                y: p1.y
            });
            app.requestMgr.commitRequest(req);
            app.requestMgr.commitSession();
        }
        this.cancel();
        return;
    }


    private _drawPreviewPolygon(result1?: T_PickPointResult, result2?: T_PickPointResult) {
        const p1 = result1?.point;
        const p2 = result2?.point;
        if (!p1 || !p2) return;
        this.clearTmp();
        const distance = MathUtil.ppDistance(p1, p2);
        const grep = new GRep();

        // 1.多边形
        const gPolygon = new GRegPolygon({
            sides: 5,
            radius: MathUtil.ppDistance(p1, p2),
            x: p1.x,
            y: p1.y
        });
        gPolygon.setStyle(CoreConfig.defaultLineEleStyle);
        grep.addNode(gPolygon);

        // 2.圆
        const gCircle = new GCircle({
            radius: distance + (CoreConfig.defaultLineEleStyle.strokeWidth || 0) / 2,
            x: p1.x,
            y: p1.y
        });
        gCircle.setStyle(CoreConfig.previewDashLineStyle);
        grep.addNode(gCircle);

        this.drawTmpGRep(grep);
        this._updateView();
    }
}