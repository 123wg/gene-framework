import { T_Constructor } from "../type_define/type_guard";
import { Request } from "./request";
import { RequestMgr } from "./request_mgr";

/**
 * 请求注册装饰器
 * @param requestId 请求id
 */
export function registerRequest(requestId:string){
    return (ctor:T_Constructor<Request>) =>{
        RequestMgr.instance().registerRequest(requestId,ctor);
    };
}
