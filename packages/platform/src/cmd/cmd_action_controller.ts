import { DefaultController, I_KeyboardEvent } from "@gene/render";
import { app } from "../app/app";
import { DebugUtil, EN_UserName, GRep, TmpElementPainter } from "@gene/core";
import { ActionResult } from "./action_result";
import { EN_HotKey } from "../hotkey/en_hotkey";


/**
 * 命令和交互动作的控制器基类
 * @template T 返回结果类型
 */
export class CmdActionController<T = unknown> extends DefaultController {
    /**
     * promise结束,cmd才结束
     */
    private _status: {
        promise: Promise<T>,
        resolve: (result: T) => void,
        finish?: boolean
    } = {
            promise: new Promise(() => undefined),
            resolve: () => undefined
        };

    /**
     * 启动的action
     */
    public action?: CmdActionController;

    /**
     * 临时元素绘制器
     */
    public _tmpElementPainters: TmpElementPainter[];

    /**
     * 状态初始化,仅由CmdMgr调用
     */
    public initStatus() {
        this._status.promise = new Promise<T>(res => this._status.resolve = res);
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
     * 执行通用交互
     */
    public async runAction<R = unknown>(action: CmdActionController<ActionResult<R>>): Promise<ActionResult<R>> {
        this.action = action as CmdActionController;

        const resultPromise = action.initStatus().promise;
        await Promise.all([resultPromise, action.execute()]);

        delete this.action;
        return resultPromise;
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
        this._status.resolve(data as T);
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

    public onKeyDown(event: I_KeyboardEvent): boolean {
        if (event.domEvent.key === EN_HotKey.ESC) {
            this.cancel();
            return true;
        }
        return false;
    }
}
