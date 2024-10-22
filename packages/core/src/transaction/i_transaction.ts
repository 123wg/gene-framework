import { I_TransactionGroup } from "./i_transaction_group";
import { I_TransactionBase } from "./i_transaction_node";
import { UndoRedoEntity } from "./undo_redo_entity";


export interface I_Transaction extends I_TransactionBase {
    readonly undoRedoEntity: UndoRedoEntity

    canUndo: boolean

    parent: I_TransactionGroup

    /**
     * 提交
     */
    commit(): boolean

    /**
     * 内部数据反向并执行,Transaction特有的方法
     */
    reverseAndExecute(): void

    /**
     * 合并
     */
    merge(another: I_Transaction): this
}
