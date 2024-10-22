import { I_Document } from "../document/i_document";
import { DebugUtil } from "../tooltik/debug_util";
import { EN_UserName } from "../tooltik/user_name";
import { T_Constructor } from "../type_define/type_guard";
import { EN_TransactionStatus, I_TransactionBase } from "./i_transaction_base";

export abstract class TransactionBase implements I_TransactionBase {
    public name: string;

    public doc: I_Document;

    protected _status = EN_TransactionStatus.NOT_STARTED;

    constructor(doc: I_Document, name: string) {
        this.name = name;
        this.doc = doc;
    }

    public abstract collectUsedIds(set: Set<number>): void;
    public start(): boolean {
        this._status = EN_TransactionStatus.STARTED;
        return true;
    }

    public getStartParent(){
        const parent = this.doc.transactionMgr.getCurrentTransactionGroup();
        DebugUtil.assert(parent, '没有找到TransactionGroup', EN_UserName.GENE, '2024-10-21');
        parent!.startTransaction(this);
        return parent!;
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
