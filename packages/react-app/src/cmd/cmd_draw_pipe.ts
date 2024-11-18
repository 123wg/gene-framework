import { app, Cmd, PickPointAction, registerCmd } from "@gene/platform";
import { EN_AppCmd } from "./cmd_id";
import { T_XY } from "@gene/core";
import { CreatePipeRequest } from "../main";

@registerCmd(EN_AppCmd.DRAW_PIPE_CMD)
export class DrawpipeCmd extends Cmd {
    public executeImmediately = false;

    public async execute() {
        const points: T_XY[] = [];
        // 加点 每加一个 提交一个request 创建管道 先删除
        while (true) {
            const action = new PickPointAction();
            const result = await this.runAction(action);
            if (result.isCanceled) {
                return;
            }
            points.push(result.data.point);

            if (points.length > 1) {
                console.log(points);
                app.requestMgr.startSession();
                const req = app.requestMgr.createRequest(CreatePipeRequest, points);
                app.requestMgr.commitRequest(req);
                app.requestMgr.commitSession();
            }
            // this._drawPipePreview(points);
        }
    }

    /**
     * 绘制管道预览
     */
    private _drawPipePreview(points: T_XY[]) {
        if (!points.length) return;

    }
}