import { I_Document } from "../document/i_document";
import { DebugUtil } from "../tooltik/debug_util";
import { EN_UserName } from "../tooltik/user_name";
import { T_Constructor } from "../type_define/type_guard";
import { EN_TransactionStatus, I_TransactionBase } from "./i_transaction_base";
import { Transaction } from "./transaction";
import { TransactionGroup } from "./transaction_group";

export class TransactionBase implements I_TransactionBase {
    public name: string;

    public doc: I_Document;

    protected _status = EN_TransactionStatus.NOT_STARTED;

    constructor(doc: I_Document, name: string) {
        this.name = name;
        this.doc = doc;
        this.start();
    }
    public start(): boolean {
        this._status = EN_TransactionStatus.STARTED;
        if (this.isTransactionLike(TransactionGroup) && this.isRoot) return true;

        // 启动事务时,需要清除redo列表
        this.doc.transactionMgr.getLastLeafTranGroup(true)?.clearRedoList();

        if (this.isTransactionLike(Transaction) || this.isTransactionLike(TransactionGroup)) {
            this.parent = this.doc.transactionMgr.getCurrentTransactionGroup();
            DebugUtil.assert(this.parent, '没有找到TransactionGroup', EN_UserName.GENE, '2024-10-21');
            this.parent?.startTransaction(this);
        }
        return true;
    }

    public getStatus(): EN_TransactionStatus {
        return this._status;
    }

    public setStatus(status: EN_TransactionStatus): void {
        this._status = status;
    }
    public rollBack(): boolean {
        this._status = EN_TransactionStatus.ROLLED_BACK;
        return true;
    }
    public isTransactionLike<T extends I_TransactionBase>(this: I_TransactionBase, ctor: T_Constructor<T>): this is T {
        return this instanceof ctor;
    }
}
