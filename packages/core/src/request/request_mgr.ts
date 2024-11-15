import { I_Document } from "../document/i_document";
import { ClassManager } from "../tooltik/class_manager";
import { DebugUtil } from "../tooltik/debug_util";
import { EN_UserName } from "../tooltik/user_name";
import { Transaction } from "../transaction/transaction";
import { TransactionGroup } from "../transaction/transaction_group";
import { T_Constructor } from "../type_define/type_guard";
import { Request } from "./request";

/**
 * 请求管理器
 */
export class RequestMgr {
    private _doc: I_Document;

    private static _instance: RequestMgr;

    /**Request类管理器*/
    private _requestClsMgr = new ClassManager<string, T_Constructor<Request>>();

    /**关联的事务组*/
    private _transGroup?: TransactionGroup;

    /**当前执行的事务*/
    private _transaction?: Transaction;

    public static instance() {
        if (!this._instance) {
            this._instance = new RequestMgr();
        }
        return this._instance;
    }

    public setDoc(doc: I_Document) {
        this._doc = doc;
    }

    /**
     * 注册请求
     */
    public registerRequest(requestId: string, request: T_Constructor<Request>) {
        this._requestClsMgr.registerCls(requestId, request);
    }

    /**
     * 创建请求
     */
    public createRequest<T extends T_Constructor<Request>>(ctor: T, ...args: ConstructorParameters<T>) {
        const req = new ctor(...args);
        req.setDoc(this._doc);
        const reqName = this._requestClsMgr.getClsNameEnsure(ctor);
        if (req.canTransact()) {
            this._transaction = new Transaction(this._doc, `${reqName}-start`);
        }

        return req;
    }

    /**
     * 开启缓存
     * 一次开启缓存到提交缓存中间的所有操作为原子操作,一起undo、redo
     */
    public startSession() {
        DebugUtil.assert(!this._transGroup, '请先提交上一个Request', EN_UserName.GENE, '2024-10-24');
        this._transGroup = new TransactionGroup(this._doc, '');
    }

    /**
     * 提交请求
     */
    public commitRequest<T extends Request>(req: T) {
        const result = req.commit();
        if (!req.canTransact()) return result;
        DebugUtil.assert(this._transaction, '请先创建一个Request', EN_UserName.GENE, '2024-11-10');
        this._transaction?.commit();
        this._transaction = undefined;
        return result;
    }

    /**
     * 提交缓存
     */
    public commitSession() {
        this._transGroup?.assimilate();
        this._clear();
    }

    /**
     * 终止缓存,所有操作回滚
     */
    public abortSession() {
        this._transGroup?.rollBack();
        this._clear();
    }

    /**
     * 清空
     */
    private _clear() {
        this._transGroup = undefined;
    }
}
