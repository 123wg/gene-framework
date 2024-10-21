import { I_Transaction } from "./i_transaction";
import { I_TransactionGroup } from "./i_transaction_group";
import { TransactionBase } from "./transaction_base";
import { UndoRedoEntity } from "./undo_redo_entity";

export class Transaction extends TransactionBase implements I_Transaction{
    undoRedoEntity: UndoRedoEntity;
    canUndo: boolean;
    parent: I_TransactionGroup;
    reverseAndExecute(): void {
        throw new Error("Method not implemented.");
    }
    merge(another: I_Transaction): this {
        throw new Error("Method not implemented.");
    }
}
