import { I_Transaction } from "./i_transaction";
import { I_TransactionBase } from "./i_transaction_base";
export interface I_TransactionGroup extends I_TransactionBase{
    /**是否为根节点*/
    isRoot: boolean

    undoList: I_TransactionBase[]

    redoList: I_TransactionBase[]

    parent?: I_TransactionGroup


    /**在本事务组内启动一个事务/事务组*/
    startTransaction(t: I_TransactionBase): void

    /**
     * https://www.revitapidocs.com/2015/65b49d46-88ec-9b8d-cd92-e3d9b2392994.htm
     * Assimilates all inner transactions by merging them into a single undo item.
     */
    assimilate(): I_Transaction | undefined

    canUndo(): boolean

    canRedo(): boolean

    undo(): boolean

    redo(): boolean

    clearRedoList(): void

    /**删除一个事务,一般用于删除空事务*/
    popTransaction(t: I_TransactionBase): boolean

    /**获取当前事务*/
    getCurrentTransaction(): I_Transaction | undefined

    /**获取当前事务组 状态为STARTED的*/
    getCurrentTransactionGroup(): I_TransactionGroup | undefined

    /**获取当前叶子节点的事务组*/
    getLastLeafTransGroup(undoList: boolean): I_TransactionGroup | undefined

    /**设置undo事务栈的最大长度,只针对根节点有效*/
    setMaxUndoStackSize(size: number): void

    /**获取undo事务栈的最大长度*/
    getMaxUndoStackSize(): number

    /**
     * 替换尾部事务,使用场景:事务组压缩成事务
     * @param tail 当前尾部事务/事务组
     * @param t 替换成的事务
     */
    replaceTailTransaction(tail: I_TransactionBase, t: I_Transaction):boolean

    undoWithoutRedo(ut:I_Transaction):boolean
}
