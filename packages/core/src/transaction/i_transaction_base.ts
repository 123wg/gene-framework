import { I_Document } from "../document/i_document";
import { T_Constructor } from "../type_define/type_guard";


export enum EN_TransactionStatus {
    /**未启动*/
    NOT_STARTED = 'not-started',
    /**已启动*/
    STARTED = 'started',
    /**已提交*/
    COMMITTED = 'committed',
    /**已回滚*/
    ROLLED_BACK = 'rolled_back',
}


export interface I_TransactionBase {
    name: string

    doc: I_Document

    // /**该transaction属于哪个事务组,不属于任何事务组的transaction是根事务组*/
    // parent:I_TransactionGroup

    /**
     * 启动事务
     */
    start(): boolean

    /**
     * 获取事务状态
     */
    getStatus(): EN_TransactionStatus

    /**
     * 修改状态 慎用！！！
     */
    setStatus(status: EN_TransactionStatus): void

    /**
     * 回滚
     */
    rollBack(): boolean

    /**
     * Transaction/TransactionGroup类型推断
     */
    isTransactionLike<T extends I_TransactionBase>(this: I_TransactionBase, ctor: T_Constructor<T>): this is T;
}
