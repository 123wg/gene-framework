import { I_ProcessEvent } from "../controller/i_process_event";
import { I_MouseEvent, I_KeyboardEvent } from "../type_define/type_define";
import { Cmd } from "./cmd";

/**
 * 接收事件
 */
export class CmdMgr implements I_ProcessEvent{
    private static _instance:CmdMgr;

    private _currentCmd?:Cmd;
    public static instance():CmdMgr {
        if(!this._instance){
            this._instance = new CmdMgr();
        }
        return this._instance;
    }

    public getCurrentCmd(){
        return this._currentCmd;
    }

    public getCurrentController(){
        let controller = this.getCurrentCmd();
        while(controller?.action) {
            controller = controller.action;
        }
        return controller;
    }


    public processMouseEvent(event: I_MouseEvent): boolean {
        const target = this.getCurrentController();
        return !!target?.processMouseEvent(event);
    }
    public processKeyboardEvent(event: I_KeyboardEvent): boolean {
        const target = this.getCurrentController();
        return !!target?.processKeyboardEvent(event);
    }
}
