import { I_Transaction } from "./i_transaction";
import { I_TransactionBase } from "./i_transaction_node";
export interface I_TransactionGroup {
    undoList:I_TransactionBase[]

    redoList:I_TransactionBase[]

    parent?:I_TransactionGroup

    /**在本事务组内启动一个事务/事务组*/
    startTransaction(t:I_TransactionBase):void

    /**
     * https://www.revitapidocs.com/2015/65b49d46-88ec-9b8d-cd92-e3d9b2392994.htm
     * Assimilates all inner transactions by merging them into a single undo item.
     */
    assimilate(): I_Transaction | undefined

    canUndo(): boolean

    canRedo(): boolean

    undo(): boolean

    redo(): boolean

    clearRedoList():void

    /**删除一个事务,一般用于删除空事务*/
    popTransaction(t:I_TransactionBase):boolean

    /**获取当前事务*/
    getCurrentTransaction():I_Transaction | undefined

    /**获取当前事务组 状态为STARTED的*/
    getCurrentTransactionGroup():I_TransactionGroup | undefined

    /**获取当前叶子节点的事务组*/
    getLastLeafTransGroup(undoList:boolean):I_TransactionGroup | undefined

    /**设置undo事务栈的最大长度,只针对根节点有效*/
    setMaxUndoStackSize(size:number):void
}
