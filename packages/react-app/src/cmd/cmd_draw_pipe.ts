import { app, Cmd, PickPointAction, PickPointObserver, registerCmd } from "@gene/platform";
import { EN_AppCmd } from "./cmd_id";
import { CoreConfig, GCircle, GLine, GRep, I_Vec2 } from "@gene/core";
import { CreatePipeRequest } from "@gene/editor-sdk";

/**
 * 绘制管道命令
 */
@registerCmd(EN_AppCmd.DRAW_PIPE_CMD)
export class DrawpipeCmd extends Cmd {
    public executeImmediately = false;

    public async execute() {
        app.selection.clear();
        this._updateView();

        const points: I_Vec2[] = [];
        let linePoints: I_Vec2[] = [];


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
    private _drawPipePreview(points: I_Vec2[], linePoints: I_Vec2[]) {
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
            inner.setStyle(CoreConfig.pipeInnerStyle);
            outer.setStyle(CoreConfig.pipeOuterStyle);
            grep.addNode(outer);
            grep.addNode(inner);
        }

        // 2.引导线
        linePoints.forEach(point => {
            const gPoint = new GCircle({
                radius: CoreConfig.previewPointSize,
                x: point.x,
                y: point.y
            });
            gPoint.setStyle(CoreConfig.previewPointStyle);
            grep.addNode(gPoint);
        });

        if (linePoints.length > 1) {
            const p1 = linePoints[0];
            const p2 = linePoints[1];
            const gLine = new GLine({
                points: [p1.x, p1.y, p2.x, p2.y]
            });
            gLine.setStyle(CoreConfig.previewDashLineStyle);
            grep.addNode(gLine);
        }

        this.drawTmpGRep(grep);
        this._updateView();
    }
}