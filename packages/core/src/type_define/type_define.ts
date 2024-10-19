import { DBBase } from "../db/db_base";
import {  T_SerializedId } from "../element/element";
import { T_Constructor } from "./type_guard";


/**db中需要保存的属性类型定义*/
export interface I_DBBaseProps {}

/**提取DBElement的泛型*/
export type T_DBElementGeneric<T> = T extends DBBase<infer P> ? P : never;

/**
 * Element的构造函数类型
 */
export type T_ElementConstructor<T> = T_Constructor<T> & {
    serializedId: T_SerializedId
}

export interface I_SignalEvent<SubjectType, DataType> {
    type?:string
    subject?:SubjectType
    data?:DataType
}

export type T_SignalCallbackFn<SubjectType, DataType> = (data:I_SignalEvent<SubjectType,DataType>) => void

export interface I_SignalCallbackItem<SubjectType, DataType> {
    listener?: unknown
    fn: T_SignalCallbackFn<SubjectType, DataType>;
}
