import { I_Document } from "../document/i_document";
import { ClassManager } from "../tooltik/class_manager";
import { DebugUtil } from "../tooltik/debug_util";
import { EN_UserName } from "../tooltik/user_name";
import { TransactionGroup } from "../transaction/transaction_group";
import { T_Constructor } from "../type_define/type_guard";
import { Request } from "./request";

/**
 * 请求管理器
 */
export class RequestMgr {
    private _transGroup?: TransactionGroup;

    private static  _instance:RequestMgr;

    public static instance(){
        if(!this._instance){
            this._instance = new RequestMgr();
        }
        return this._instance;
    }

    // private _doc: I_Document;

    private _requestClsMgr = new ClassManager<string,T_Constructor<Request>>();

    // TODO 每个都要调用super 需要优化一下
    // constructor(doc: I_Document) {
    //     this._doc = doc;
    // }

    /**
     * 注册请求
     */
    public registerRequest(requestId:string, request:T_Constructor<Request>) {
        this._requestClsMgr.registerCls(requestId,request);
    }

    /**
     * 开启缓存
     * 一次开启缓存到提交缓存中间的所有操作为原子操作,一起undo、redo
     */
    public startSession(doc:I_Document) {
        DebugUtil.assert(!this._transGroup,'请先提交上一个Request',EN_UserName.GENE,'2024-10-24');
        this._transGroup = new TransactionGroup(doc, '');
    }

    /**
     * 提交请求
     */
    public commitRequest(req: Request) {
        // TODO 录制相关
        return req.commit();
    }

    /**
     * 提交缓存
     */
    public commitSession() {
        this._transGroup?.assimilate();
    }

    /**
     * 终止缓存,所有操作回滚
     */
    public abortSession(){
        this._transGroup?.rollBack();
    }
}
