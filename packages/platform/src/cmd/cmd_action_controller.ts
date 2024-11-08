import { DefaultController } from "@gene/render";
import { app } from "../app/app";
import { DebugUtil, EN_UserName, GRep, TmpElementPainter } from "@gene/core";


/**
 * 命令和交互动作的控制器基类
 * @template T 返回结果类型
 */
export class CmdActionController<T = void> extends DefaultController {
    /**
     * promise结束,cmd才结束
     */
    private _status: {
        promise: Promise<T | undefined>,
        resolve: (result: T | undefined) => void,
        finish?: boolean
    };

    /**
     * 启动的action
     */
    public action?: CmdActionController<T>;

    /**
     * 临时元素绘制器
     */
    public _tmpElementPainters: TmpElementPainter[];

    /**
     * 状态初始化,仅由CmdMgr调用
     */
    public initStatus() {
        this._status.promise = new Promise<T | undefined>(res => this._status.resolve = res);
        delete this._status.finish;

        this._tmpElementPainters = [new TmpElementPainter(this.getDoc())];
        return this._status;
    }

    /**
     * 获取画布
     */
    public getCanvas() {
        return app.getCanvas();
    }


    /**
     * 获取文档
     */
    public getDoc() {
        return app.doc;
    }

    /**
     * 请求刷新
     */
    protected _updateView() {
        this.getDoc().updateView();
    }

    /**
     * 命令执行
     */
    public async execute(..._cmdParams: unknown[]) {

    }

    /**
     * 命令取消
     */
    public cancel() {
        this._resolve();
    }

    /**
     * 命令销毁回调
     */
    public onDestroy() {
        this.destroyAllTmpPainters();
    }

    /**
     * 标记执行结束并返回结果
     */
    protected _resolve(data?: T): void {
        if (this._status.finish) return;

        this._status.finish = true;
        this._status.resolve(data);
        this.onDestroy();
    }

    /**
     * 绘制临时元素
     * @param grep 显示对象
     * @param index 画布索引
     */
    public drawTmpGRep(grep: GRep, index = 0) {
        if (index < 0 || index >= this._tmpElementPainters.length) {
            DebugUtil.assert(false, 'index无效', EN_UserName.GENE, '2024-11-08');
            return;
        }
        this._tmpElementPainters[index].drawTmpGRep(grep);
    }

    /**
     * 清除所有绘制器内临时元素
     */
    public clearTmp() {
        for (const painter of this._tmpElementPainters) {
            painter.clearTmp();
        }
    }

    /**
     * 销毁所有临时绘制器
     */
    public destroyAllTmpPainters() {
        for (let i = 0; i < this._tmpElementPainters.length; i++) {
            this._tmpElementPainters[i].destroy();
        }
        this._tmpElementPainters.splice(0);
    }

}
