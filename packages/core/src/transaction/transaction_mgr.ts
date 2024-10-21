import { I_TransactionGroup } from "./i_transaction_group";

/**
 * 事务管理器
 */
export class TransactionMgr {

    /**
     * 获取最后的叶子节点事务组
     */
    getLastLeafTranGroup(_undoList:boolean):I_TransactionGroup | undefined {
        // TODO 方法完善
        return undefined;
    }

    /**
     * 获取当前事务组
     */
    getCurrentTransactionGroup():I_TransactionGroup | undefined{
        // TODO 方法完善
        return undefined;
    }
}
