import { I_Document } from "../document/i_document";
import { DebugUtil } from "../tooltik/debug_util";
import { EN_UserName } from "../tooltik/user_name";
import { I_Transaction } from "./i_transaction";
import { I_TransactionGroup } from "./i_transaction_group";
import { TransactionGroup } from "./transaction_group";
import { UndoRedoEntity } from "./undo_redo_entity";

/**
 * 事务管理器
 */
export class TransactionMgr {
    /**事务树的根节点*/
    private _rootNode: I_TransactionGroup;

    public init(doc: I_Document) {
        this._rootNode = new TransactionGroup(doc, 'root', true);
        this.setMaxUndoStackSize(50);
    }

    /**
     * 清空事务树
     */
    public clear() {
        this._rootNode.undoList.splice(0);
        this._rootNode.clearRedoList();
    }

    /**
     * 设置最大回撤步数
     */
    public setMaxUndoStackSize(size: number) {
        this._rootNode.setMaxUndoStackSize(size);
    }

    /**
     * 获取当前正在进行的事务
     */
    public getCurrentTransaction(): I_Transaction | undefined {
        const group = this._rootNode.getCurrentTransactionGroup();
        if (!group) return undefined;
        return group.getCurrentTransaction();
    }

    /**
     * 获取当前事务组
     */
    public getCurrentTransactionGroup(): I_TransactionGroup | undefined {
        return this._rootNode.getCurrentTransactionGroup();
    }

    /**
     * 获取最后的叶子节点事务组
     */
    public getLastLeafTranGroup(undoList: boolean): I_TransactionGroup | undefined {
        return this._rootNode.getLastLeafTransGroup(undoList);
    }

    /**
     * 获取当前正在进行的事务的undoRedoEntity
     */
    public getCurrentUndoRedoEntity(): UndoRedoEntity {
        DebugUtil.assert(this.getCurrentTransaction(), '没有事务', EN_UserName.GENE, '2024-10-22');
        return this.getCurrentTransaction()!.undoRedoEntity;
    }

    /**
     * 撤销
     */
    public undo() {
        const result = !!this.getLastLeafTranGroup(true)?.undo();
        return result;
    }

    /**
     * 回退
     */
    public redo() {
        const result = !!this.getLastLeafTranGroup(false)?.redo();
        return result;
    }

    /**
     * 是否可撤销
     */
    public canUndo() {
        return !!this.getLastLeafTranGroup(true)?.canUndo();
    }

    /**
     * 是否可回退
     */
    public canRedo() {
        return !!this.getLastLeafTranGroup(false)?.canRedo();
    }

    public idPoolGC(): Set<number> {
        const set = new Set<number>();
        this._rootNode.collectUsedIds(set);
        return set;
    }
}
