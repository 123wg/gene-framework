import { Element } from "../element/element";
import { ElementId } from "../element/element_id";
import { ModelView } from "../model_view/model_view";
import { TransactionMgr } from "../transaction/transaction_mgr";
import { EN_ModelViewChanged } from "../type_define/type_define";
import { T_Constructor } from "../type_define/type_guard";
import { ElementMgr } from "./element_manager";
import { IDPool } from "./id_pool";

export interface I_Document {
    /**是否为主文档*/
    isMainDoc?: boolean

    idPool: IDPool

    /**对象管理器*/
    readonly elementMgr: ElementMgr

    /**事务管理器*/
    readonly transactionMgr: TransactionMgr

    /**模型层视图*/
    readonly modelView: ModelView

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

    /**根据id数组获取Element数组*/
    getElementsByIds(eleIds: (ElementId | number)[]): Element[]

    /**
     * 获取某一Class的所有实例Element
     * 不可通过此方法获取基类的所有派生实例
     */
    getAllElementsByCtor<T extends Element>(filterType?: T_Constructor<T>): T[]

    /**过滤Elements*/
    filterElements(filter?: (ele: Element) => boolean): Element[]

    /**检查是否可以修改文档*/
    checkIfCanModifyDoc(): void

    /**
     * 更新视图
     * @rebuld 是否强制更新
     */
    updateView(rebuild?: boolean): void

    /**
     * 缓存Element变化
     */
    cacheElementChanged(type: EN_ModelViewChanged, elements: Element[]): void

    /**文档销毁*/
    destroy(): void
}
