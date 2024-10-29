import { ClassManager, DebugUtil, EN_UserName, T_Constructor } from "@gene/core";
import { Cmd } from "./cmd";
import { CmdActionController } from "./cmd_action_controller";
import { I_KeyboardEvent, I_MouseEvent, I_ProcessEvent } from "@gene/render";

/**
 * 命令管理器
 */
export class CmdMgr implements I_ProcessEvent {
    private static _instance: CmdMgr;

    /**
     * 是否忙碌
     */
    private _isBusy = false;

    /**
     * 当前正在执行的命令
     */
    private _currentCmd?: Cmd;

    /**
     * Cmd的Class管理
     */
    private _cmdClsMgr = new ClassManager<string, T_Constructor<Cmd>>();

    public static instance(): CmdMgr {
        if (!this._instance) {
            this._instance = new CmdMgr();
        }
        return this._instance;
    }

    /**
     * 注册命令
     */
    public registerCmd(cmdId: string, cmd: T_Constructor<Cmd>) {
        this._cmdClsMgr.registerCls(cmdId, cmd);
    }


    /**
     * 发起命令
     */
    public async sendCmd(cmdId: string, ...cmdParams: unknown[]): Promise<boolean> {
        const Ctor = this._cmdClsMgr.getCls(cmdId);
        DebugUtil.assert(Ctor, `cant find command ${cmdId}`, EN_UserName.GENE, '2024-10-28');
        if (!Ctor) return false;

        // 上次命令没有结束 必须等待
        while (this._isBusy) {
            this.resetAllCmdAndAction();
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        // TODO 发送开始的事件
        const cmd = new Ctor();
        this._currentCmd = cmd;
        this._isBusy = true;

        const status = cmd.initStatus();
        const execute = cmd.execute(...cmdParams);

        // 立即模式
        if (cmd.executeImmediately) {
            status.resolve();
        }

        await Promise.all([status.promise, execute]).catch(e => {
            console.error(e);
        });

        cmd.onDestroy();

        // TODO 发送结束事件
        return true;
    }

    /**
     * 获取当前执行的命令
     */
    public getCurrentCmd() {
        return this._currentCmd;
    }

    /**
     * 获取当前可响应事件的控制器
     */
    public getCurrentController() {
        let controller: CmdActionController | undefined = this.getCurrentCmd();
        while (controller?.action) {
            controller = controller.action;
        }
        return controller;
    }

    /**
     * 取消所有命令和交互动作
     */
    public resetAllCmdAndAction() {
        const cmd = this.getCurrentCmd();
        if (!cmd) return;
        const actions: CmdActionController[] = [cmd];
        while (actions[actions.length - 1].action) {
            actions.push(actions[actions.length - 1].action!);
        }

        actions.reverse().forEach(c => c.cancel);
        this._isBusy = false;
    }

    /**
     * 鼠标事件分发
     */
    public processMouseEvent(event: I_MouseEvent): boolean {
        const target = this.getCurrentController();
        return !!target?.processMouseEvent(event);
    }

    /**
     * 键盘事件分发
     */
    public processKeyboardEvent(event: I_KeyboardEvent): boolean {
        const target = this.getCurrentController();
        return !!target?.processKeyboardEvent(event);
    }
}
