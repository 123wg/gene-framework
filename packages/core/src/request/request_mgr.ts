import { I_Document } from "../document/i_document";
import { DebugUtil } from "../tooltik/debug_util";
import { EN_UserName } from "../tooltik/user_name";
import { TransactionGroup } from "../transaction/transaction_group";
import { Request } from "./request";

/**
 * Request管理器
 * Request使用前,由RequestMgr启动并创建事务组
 * Request提交由RequestMgr负责
 * 对于拖动等需要连续提交的Request 每次都创建新的req提交,因为开启缓存的req本质上提交缓存时会进行一次merge
 */
export class RequestMgr {
    private _transGroup?: TransactionGroup;

    private _doc: I_Document;

    // TODO 每个都要调用super 需要优化一下
    constructor(doc: I_Document) {
        this._doc = doc;
    }

    /**
     * 启动缓存,创建事务组
     */
    public startSession() {
        DebugUtil.assert(!this._transGroup,'请先提交上一个Request',EN_UserName.GENE,'2024-10-24');
        this._transGroup = new TransactionGroup(this._doc, '');
    }

    public commitRequest(req: Request) {
        // TODO 录制相关
        return req.commit();
    }

    public commitSession() {
        this._transGroup?.assimilate();
    }

    public abortSession(){
        this._transGroup?.rollBack();
    }
}
