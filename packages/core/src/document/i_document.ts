import { Element } from "../element/element";
import { ElementId } from "../element/element_id";
import { TransactionMgr } from "../transaction/transaction_mgr";
import { ElementMgr } from "./element_manager";

export interface I_Document {
    /**对象管理器*/
    elementMgr:ElementMgr

    /**事务管理器*/
    transactionMgr:TransactionMgr

    /**根据id获取Element*/
    getElementById<T = Element>(eleId:ElementId | number):T | undefined

    /**根据id获取Element*/
    getElementByIdEnsure<T = Element>(eleId:ElementId | number):T

    /**检查是否可以修改文档*/
    checkIfCanModifyDoc():void
}
