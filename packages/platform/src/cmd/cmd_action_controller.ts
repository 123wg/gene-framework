import { DefaultController } from "../controller/default_controller";

/**
 * Cmd和Action共同的Controller基类
 * @template T 返回结果类型
 */
export class CmdActionController<T> extends DefaultController {
    /**
     * 启动的action
     */
    public action?: CmdActionController<T>;

    /**
     * promise结束,cmd才结束
     */
    private _status: {
        promise: Promise<T | undefined>,
        resolve: (result: T | undefined) => void,
        finish?: boolean
    };

    /**
     * 状态初始化,仅由CmdMgr调用
     */
    public initStatus() {
        this._status.promise = new Promise<T | undefined>(res => this._status.resolve = res);
        delete this._status.finish;

        return this._status;
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
    public onDestroy() { }

    /**
     * 标记执行结束并返回结果
     */
    protected _resolve(data?: T): void {
        if (this._status.finish) return;

        this._status.finish = true;
        this._status.resolve(data);
        this.onDestroy();
    }
}
