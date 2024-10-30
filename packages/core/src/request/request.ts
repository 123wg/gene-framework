import { I_Document } from "../document/i_document";
import { I_Transaction } from "../transaction/i_transaction";
import { Transaction } from "../transaction/transaction";

/**
 * 请求抽象类
 */
export abstract class Request {
    private _transaction: I_Transaction;

    protected _doc: I_Document;
    constructor(doc: I_Document) {
        this._doc = doc;
        this._transaction = new Transaction(this._doc, '');
    }

    public abstract onCommit(): unknown

    public commit() {
        const result = this.onCommit();
        this._transaction.commit();
        return result;
    }
}
