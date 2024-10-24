import { I_Document } from "../document/i_document";
import { TransactionGroup } from "../transaction/transaction_group";

/**
 * Request管理器
 * Request使用前,由RequestMgr启动并创建事务组
 * Request提交由RequestMgr负责
 * 对于拖动等需要连续提交的Request 需要merge到上一个Request
 * 方法:
 */
export class RequestMgr {
    private _transGroup?: TransactionGroup;

    private _sessionStack: Request[] = [];

    private _doc: I_Document;

    constructor(doc: I_Document) {
        this._doc = doc;
    }

    public startSession() {
        this._transGroup = new TransactionGroup(this._doc, '');
    }

    public commitRequest(req: Request) {
        this._sessionStack.push(req);
    }

    public commitSession() {
        this._transGroup?.assimilate();
    }
}