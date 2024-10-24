import { I_Document } from "../document/i_document";
import { I_Transaction } from "../transaction/i_transaction";
import { Transaction } from "../transaction/transaction";

export abstract class Request {
    private _transaction: I_Transaction;

    protected _doc:I_Document;
    constructor(doc:I_Document) {
        this._doc = doc;
        this._transaction = new Transaction(this._doc,'');
    }

    protected abstract _onCommit():unknown

    public commit(){
        this._onCommit();
        this._transaction.commit();
    }
}
