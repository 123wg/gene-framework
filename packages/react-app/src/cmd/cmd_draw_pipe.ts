import { app, Cmd, PickPointAction, PickPointObserver, registerCmd } from "@gene/platform";
import { EN_AppCmd } from "./cmd_id";
import { CoreConfig, GCircle, GLine, GRep, T_XY } from "@gene/core";
import { PlatFormConfig } from "@gene/platform/src/toolkit/platform_config";
import { CreatePipeRequest } from "../main";

/**
 * 绘制管道命令
 */
@registerCmd(EN_AppCmd.DRAW_PIPE_CMD)
export class DrawpipeCmd extends Cmd {
    public executeImmediately = false;

    public async execute() {
        const points: T_XY[] = [];
        let linePoints: T_XY[] = [];


        const observer = new PickPointObserver({
            movingCallback: (result) => {
                if (!points.length) linePoints = [result.point];
                else linePoints = [points[points.length - 1], result.point];
                this._drawPipePreview(points, linePoints);
            }
        });

        while (true) {
            const action = new PickPointAction(observer);
            const result = await this.runAction(action);
            if (result.isCanceled) {
                if (points.length > 1) {
                    app.requestMgr.startSession();
                    const req = app.requestMgr.createRequest(CreatePipeRequest, points);
                    app.requestMgr.commitRequest(req);
                    app.requestMgr.commitSession();
                }
                this.cancel();
                return;
            }
            points.push(result.data.point);
            this._drawPipePreview(points, linePoints);
        }
    }

    /**
     * 绘制管道预览
     */
    private _drawPipePreview(points: T_XY[], linePoints: T_XY[]) {
        this.clearTmp();

        const grep = new GRep();

        // 1.管道
        if (points.length > 1) {
            const pointsFlat = points.flatMap(p => { return [p.x, p.y]; });
            const inner = new GLine({
                points: pointsFlat
            });
            const outer = new GLine({
                points: pointsFlat
            });
            inner.setStyle({
                stroke: CoreConfig.pipeInnerStroke,
                dash: CoreConfig.pipeInnerDash,
                strokeWidth: CoreConfig.pipeInnerWidth
            });
            outer.setStyle({
                stroke: CoreConfig.pipeOuterStroke,
                strokeWidth: CoreConfig.pipeOuterWidth
            });
            grep.addNode(outer);
            grep.addNode(inner);
        }

        // 2.引导线
        linePoints.forEach(point => {
            const gPoint = new GCircle({
                radius: PlatFormConfig.pickPointSize,
                x: point.x,
                y: point.y
            });
            gPoint.setStyle(PlatFormConfig.pickPointStyle);
            grep.addNode(gPoint);
        });

        if (linePoints.length > 1) {
            const p1 = linePoints[0];
            const p2 = linePoints[1];
            const gLine = new GLine({
                points: [p1.x, p1.y, p2.x, p2.y]
            });
            gLine.setStyle(PlatFormConfig.pickLineStyle);
            grep.addNode(gLine);
        }

        this.drawTmpGRep(grep);
        this._updateView();
    }
}