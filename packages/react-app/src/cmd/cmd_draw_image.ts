import { app, Cmd, PickPointAction, PickPointObserver, registerCmd, T_PickPointResult } from "@gene/platform";
import { EN_AppCmd } from "./cmd_id";
import { AssetsMgr, CoreConfig, GImage, GRep } from "@gene/core";
import { CreateImageRequest } from "@gene/editor-sdk";

/**
 * 绘制图片命令
 */
@registerCmd(EN_AppCmd.DRAW_IMAGE)
export class DrawImageCmd extends Cmd {
    public executeImmediately = false;

    private _imageSrc: string;

    public async execute(src: string) {
        app.selection.clear();
        this._updateView();
        this._imageSrc = src;
        const observer = new PickPointObserver({
            movingCallback: (result) => {
                this._drawPreview(result);
            }
        });
        const action = new PickPointAction(observer);
        const result = await this.runAction(action);
        if (result.isSuccess) {
            app.requestMgr.startSession();
            const p = result.data.point;
            const aspect = AssetsMgr.instance().getImageEnsure(this._imageSrc).aspect;
            const req = app.requestMgr.createRequest(CreateImageRequest, this._imageSrc, p.x, p.y, CoreConfig.previewImgWidth, CoreConfig.previewImgWidth / aspect,);
            app.requestMgr.commitRequest(req);
            app.requestMgr.commitSession();
        }
        this.cancel();
        return;
    }

    private _drawPreview(result: T_PickPointResult) {
        this.clearTmp();
        // 画图片
        const grep = new GRep();
        const info = AssetsMgr.instance().getImageEnsure(this._imageSrc);
        const height = CoreConfig.previewImgWidth / info.aspect;

        const gImage = new GImage({
            image: info.imageObj,
            x: result.point.x,
            y: result.point.y,
            width: CoreConfig.previewImgWidth,
            height
        });
        grep.addNode(gImage);
        this.drawTmpGRep(grep);
        this._updateView();
    }
}
