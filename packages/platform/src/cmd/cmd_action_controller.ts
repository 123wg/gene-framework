import { DefaultController } from "../controller/default_controller";

/**
 * Cmd和Action共同的Controller基类
 */
export class CmdActionController<T> extends DefaultController {
    /**
     * 启动的action
     */
    public action?:CmdActionController;

    /**
     * promise结束,cmd才结束
     */
    private _status:{
        promise:Promise<T>,
        resolve:(result:T)=>void,
        finish?:boolean
    };

    /**
     * 命令执行
     */
    public async execute(..._cmdParams:unknown[]){

    }


    /**
     * 命令取消
     */
    public cancel(){
        this._resolve();
    }

    protected _resolve(){

    }
}
