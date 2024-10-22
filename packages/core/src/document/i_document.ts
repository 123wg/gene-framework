import { Element } from "../element/element";
import { ElementId } from "../element/element_id";
import { TransactionMgr } from "../transaction/transaction_mgr";
import { T_Constructor } from "../type_define/type_guard";
import { ElementMgr } from "./element_manager";

export interface I_Document {
    /**是否为主文档*/
    isMainDoc?: boolean

    /**对象管理器*/
    readonly elementMgr: ElementMgr

    /**事务管理器*/
    readonly transactionMgr: TransactionMgr

    getUUID(): string

    /**
     * 创建对象
     */
    create<T extends Element>(ctor: T_Constructor<T>): T

    /**
     * 根据id删除对象
     */
    deleteElementsById(...eleIds: (ElementId | number | number[] | ElementId[])[]): boolean

    /**根据id获取Element*/
    getElementById<T = Element>(eleId: ElementId | number): T | undefined

    /**根据id获取Element*/
    getElementByIdEnsure<T = Element>(eleId: ElementId | number): T

    /**
     * 获取某一Class的所有实例Element
     * 不可通过此方法获取基类的所有派生实例
     */
    getAllElementsByCtor<T extends Element>(filterType?: T_Constructor<T>): T[]

    /**检查是否可以修改文档*/
    checkIfCanModifyDoc(): void

    /**文档销毁*/
    destroy(): void
}
