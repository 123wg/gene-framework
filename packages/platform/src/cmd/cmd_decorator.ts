import { T_Constructor } from "@gene/core";
import { Cmd } from "./cmd";
import { CmdMgr } from "./cmd_mgr";

/**
 * 注册命令的装饰器
 * @param cmdId 命令的id
 *
 */
export function registerCmd<T extends Cmd>(cmdId:string){
    return (ctor:T_Constructor<T>) =>{
        CmdMgr.instance().registerCmd(cmdId,ctor);
    };
}
