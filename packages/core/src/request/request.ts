import { I_Transaction } from "../transaction/i_transaction";
import { Transaction } from "../transaction/transaction";

export class Request {
    private _transaction: I_Transaction;

    constructor() {
        this._transaction = new Transaction();
    }

    public commit(): void {

    }

    public cancel() {

    }
}