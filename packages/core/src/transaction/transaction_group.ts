import { I_Transaction } from "./i_transaction";
import { I_TransactionGroup } from "./i_transaction_group";
import { I_TransactionBase } from "./i_transaction_node";
import { TransactionBase } from "./transaction_base";

export class TransactionGroup extends TransactionBase implements I_TransactionGroup{
    public isRoot: boolean = false;

    public undoList: I_TransactionBase[];

    public redoList: I_TransactionBase[];

    public parent?: I_TransactionGroup | undefined;

    startTransaction(t: I_TransactionBase): void {
        throw new Error("Method not implemented.");
    }
    assimilate(): I_Transaction | undefined {
        throw new Error("Method not implemented.");
    }
    canUndo(): boolean {
        throw new Error("Method not implemented.");
    }
    canRedo(): boolean {
        throw new Error("Method not implemented.");
    }
    undo(): boolean {
        throw new Error("Method not implemented.");
    }
    redo(): boolean {
        throw new Error("Method not implemented.");
    }
    clearRedoList(): void {
        throw new Error("Method not implemented.");
    }
    popTransaction(t: I_TransactionBase): boolean {
        throw new Error("Method not implemented.");
    }
    getCurrentTransaction(): I_Transaction | undefined {
        throw new Error("Method not implemented.");
    }
    getCurrentTransactionGroup(): I_TransactionGroup | undefined {
        throw new Error("Method not implemented.");
    }
    getLastLeafTransGroup(undoList: boolean): I_TransactionGroup | undefined {
        throw new Error("Method not implemented.");
    }
    setMaxUndoStackSize(size: number): void {
        throw new Error("Method not implemented.");
    }
}
