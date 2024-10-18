import { DBBase } from "../db/db_base";
import { T_SerializedId } from "../element/element";
import { T_Constructor } from "./type_guard";


/**db中需要保存的属性类型定义*/
export interface I_DBBaseProps { }

/**db的属性键联合类型*/
export type T_DBCacheProps<T extends DBBase> = keyof Required<T['cache']>

/**
 * Element的构造函数类型
 */
export type T_ElementConstructor<T> = T_Constructor<T> & {
    serializedId: T_SerializedId
}